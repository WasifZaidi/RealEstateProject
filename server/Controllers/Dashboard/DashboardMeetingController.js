const Meeting = require("../../Model/Meeting");
const Agent = require("../../Model/Agent");
const mongoose = require("mongoose");
exports.getAgentMeetings = async (req, res) => {
  // Add request tracking for debugging
  const requestId = req.id || Math.random().toString(36).substring(7);

  try {
    const userId = req.user?.id;
    if (!userId) {
      console.warn(`🚫 [${requestId}] Unauthorized access attempt`);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in.",
      });
    }

    // 2️⃣ Find the agent associated with this user
    const agent = await Agent.findOne({ user: userId }).select("agentId").lean();
    if (!agent) {
      console.warn(`🚫 [${requestId}] Agent not found for user: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "Agent profile not found for this user.",
      });
    }

    const agentId = agent.agentId;
    const {
      status,
      meetingPublic_Id,
      listing_publicId,
      type,
      startDate,
      endDate,
      lat,
      lng,
      radius = 10,
      page = 1,
      limit = 10,
      search // Generic search parameter
    } = req.query;

    // ---------- Input Validation & Sanitization ----------
    const pageNum = Math.max(1, parseInt(page));
    const pageLimit = Math.min(Math.max(1, parseInt(limit)), 100); // Cap at 100 to prevent abuse
    const skip = (pageNum - 1) * pageLimit;

    // Validate date formats
    if (startDate && isNaN(new Date(startDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date format",
      });
    }

    if (endDate && isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid end date format",
      });
    }

    // ---------- Enhanced Query Building ----------
    const query = { agentId };

    // ✅ Filter by status with validation
    const validStatuses = ['scheduled', 'completed', 'cancelled', 'rescheduled'];
    if (status && validStatuses.includes(status)) {
      query.status = status;
    } else if (status) {
      console.warn(`⚠️ [${requestId}] Invalid status filter: ${status}`);
    }

    // ✅ Enhanced search functionality - search by meetingPublic_Id or generic search
    if (search) {
      query.$or = [
        { meetingPublic_Id: { $regex: search, $options: 'i' } },
        { 'client.name': { $regex: search, $options: 'i' } },
        { 'listing.title': { $regex: search, $options: 'i' } }
      ];
    } else if (meetingPublic_Id) {
      // Backward compatibility for direct meetingPublic_Id filter
      query.meetingPublic_Id = meetingPublic_Id;
    }

    // ✅ Filter by listing_publicId
    if (listing_publicId) query.listing_publicId = listing_publicId;

    // ✅ Filter by meeting type with validation
    const validTypes = ['virtual', 'phone', 'in_person'];
    if (type && validTypes.includes(type)) {
      query.type = type;
    } else if (type) {
      console.warn(`⚠️ [${requestId}] Invalid type filter: ${type}`);
    }

    // ✅ Filter by date range with validation
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // ✅ Geo filter with validation
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = Math.min(parseFloat(radius), 100); // Cap radius at 100km

      if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
        return res.status(400).json({
          success: false,
          message: "Invalid geo parameters",
        });
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({
          success: false,
          message: "Invalid latitude or longitude values",
        });
      }

      query["location.coordinates"] = {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude],
            radiusKm / 6378.1, // convert km → radians
          ],
        },
      };
    }

    // ---------- Optimized Database Query ----------
    const [meetings, total] = await Promise.all([
      Meeting.find(query)
        .populate("client", "name email phone")
        .populate("agent", "name email")
        .populate("listing", "title price status location")
        .sort({ date: -1, createdAt: -1 }) // multiple sort criteria
        .skip(skip)
        .limit(pageLimit)
        .lean()
        .maxTimeMS(30000), // 30 second timeout
      Meeting.countDocuments(query).maxTimeMS(15000) // 15 second timeout for count
    ]);

    // ---------- Response Data Sanitization ----------
    const sanitizedMeetings = meetings.map(meeting => ({
      ...meeting,
      // Ensure sensitive data is not exposed
      client: meeting.client ? {
        name: meeting.client.name,
        email: meeting.client.email,
        phone: meeting.client.phone
      } : null,
      agent: meeting.agent ? {
        name: meeting.agent.name,
        email: meeting.agent.email
      } : null
    }));

    console.log(`✅ [${requestId}] Successfully fetched ${meetings.length} meetings for agent ${agentId}`);


    console.log(sanitizedMeetings)
    // ---------- Response with Cache Headers ----------
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageLimit),
      currentPage: pageNum,
      results: sanitizedMeetings.length,
      meetings: sanitizedMeetings,
    });

  } catch (error) {
    console.error(`❌ [${requestId}] Error fetching meetings:`, error);
    
    // Different error responses based on error type
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
      });
    }
    
    if (error.name === 'TimeoutError') {
      return res.status(504).json({
        success: false,
        message: "Request timeout",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching meetings",
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    });
  }
};

exports.cancelMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user.id;

    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: "Meeting ID is required to cancel a tour",
      });
    }
    const meeting = await Meeting.findOne({ meetingPublic_Id: meetingId });
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Tour not found with this ID",
      });
    }
    if (
      meeting.client.toString() !== userId &&
      meeting.agent.toString() !== userId &&
      meeting.createdBy.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this tour",
      });
    }


    if (meeting.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This tour is already cancelled",
      });
    }

    if (meeting.status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "You cannot cancel a completed tour",
      });
    }


    meeting.status = "Cancelled";
    meeting.cancelledAt = new Date();
    meeting.cancelledBy = userId;

    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Tour cancelled successfully",
      meetingPublic_Id: meeting.meetingPublic_Id,
      status: meeting.status,
    });
  } catch (error) {
    console.error("❌ Tour cancellation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};