const Meeting = require("../../Model/Meeting");
const Agent = require("../../Model/Agent");
const mongoose = require("mongoose");

exports.getAgentMeetings = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not logged in.",
      });
    }

    // 2️⃣ Find the agent associated with this user
    const agent = await Agent.findOne({ user: userId }).select("agentId");
    if (!agent) {
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
      radius = 10, // km
      page = 1,
      limit = 10,
    } = req.query;

    // ---------- Base Query ----------
    const query = { agentId };

    // ✅ Filter by status
    if (status) query.status = status;

    // ✅ Filter by meetingPublic_Id
    if (meetingPublic_Id) query.meetingPublic_Id = meetingPublic_Id;

    // ✅ Filter by listing_publicId
    if (listing_publicId) query.listing_publicId = listing_publicId;

    // ✅ Filter by meeting type
    if (type) query.type = type;

    // ✅ Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // ✅ Geo filter (optional)
    if (lat && lng) {
      query["location.coordinates"] = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6378.1, // convert km → radians
          ],
        },
      };
    }

    // ---------- Pagination ----------
    const pageNum = Math.max(1, parseInt(page));
    const pageLimit = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * pageLimit;

    // ---------- Query DB ----------
    const [meetings, total] = await Promise.all([
      Meeting.find(query)
        .populate("client", "name email")
        .populate("agent", "name email")
        .populate("listing", "title price status")
        .sort({ date: -1 }) // newest first
        .skip(skip)
        .limit(pageLimit)
        .lean(),
      Meeting.countDocuments(query),
    ]);

    // ---------- Response ----------
    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / pageLimit),
      currentPage: pageNum,
      results: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error("❌ Error fetching meetings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching meetings",
      error: error.message,
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