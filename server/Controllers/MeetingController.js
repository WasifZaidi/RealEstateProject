const Agent = require("../Model/Agent")
const Meeting = require("../Model/Meeting");
const Listing = require("../Model/Listing");
const { nanoid } = require("nanoid");

exports.createTour = async (req, res) => {
  try {
    const { agentId, date, notes, listingId, clientContacts } = req.body;
    const client = req.user?.id;

    // 1️⃣ Validate required fields
    if (!client || !agentId || !date || !listingId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: client, agentId, date, or listingId.",
      });
    }

    // 2️⃣ Validate client contacts
    if (
      !clientContacts ||
      !clientContacts.name ||
      !clientContacts.phone ||
      !clientContacts.email
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required client contact details (name, phone, email).",
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format.",
      });
    }

    // 3️⃣ Check if user recently cancelled 2 or more tours
    const recentCancelledTours = await Meeting.find({ cancelledBy: client })
      .sort({ cancelledAt: -1 })
      .limit(2)
      .select("cancelledAt");

    if (recentCancelledTours.length >= 2) {
      const lastCancelledAt = recentCancelledTours[0]?.cancelledAt;
      if (lastCancelledAt) {
        const nextAllowedDate = new Date(lastCancelledAt);
        nextAllowedDate.setDate(nextAllowedDate.getDate() + 7);

        if (new Date() < nextAllowedDate) {
          const remainingDays = Math.ceil(
            (nextAllowedDate - new Date()) / (1000 * 60 * 60 * 24)
          );

          return res.status(403).json({
            success: false,
            message: `You've exceeded the cancellation limit. You can schedule a new tour after ${remainingDays} day(s).`,
            nextAllowedDate,
          });
        }
      }
    }

    // 4️⃣ Find the agent
    const agentData = await Agent.findOne({ agentId }).populate("user", "Email");
    if (!agentData) {
      return res.status(404).json({
        success: false,
        message: "Agent not found with this ID.",
      });
    }

    // 5️⃣ Validate listing & location
    const foundListing = await Listing.findById(listingId).select("location");
    if (
      !foundListing ||
      !foundListing.location?.city ||
      !foundListing.location?.state
    ) {
      return res.status(400).json({
        success: false,
        message: "Listing location is missing or incomplete.",
      });
    }

    // 6️⃣ Prevent duplicate tour on same day with same agent
    const existingTour = await Meeting.findOne({
      client,
      agentId,
      date: parsedDate,
      status: "Scheduled",
    });

    if (existingTour) {
      return res.status(400).json({
        success: false,
        message: "A tour with this agent at the selected date and time already exists.",
      });
    }

    // 7️⃣ Generate meeting public ID
    const meetingPublic_Id = `Met-${nanoid(10)}`;

    console.log(agentData)

    // 8️⃣ Snapshot agent contacts
    const agentContacts = {
      firstName: agentData.profile.firstName,
      lastName: agentData.profile.lastName,
      phone: agentData.profile.phone,
      email: agentData.user.Email,
    };

    // 9️⃣ Create new meeting
    const newMeeting = await Meeting.create({
      client,
      agent: agentData.user._id,
      agentId: agentData.agentId,
      listing: listingId,
      listing_publicId: "LI-123456",
      type: "Tour",
      date: parsedDate,
      notes,
      location: foundListing.location,
      status: "Scheduled",
      meetingPublic_Id,
      createdBy: req.user._id,
      agentContacts,
      clientContacts, // ✅ Save client contact info from frontend
    });

    // 🔟 Send success response
    return res.status(201).json({
      success: true,
      message: "Tour scheduled successfully.",
      meetingPublic_Id: newMeeting.meetingPublic_Id,
    });
  } catch (error) {
    console.error("❌ Tour creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


exports.getAgentMeetingDates = async (req, res) => {
  try {
    const { agentId } = req.params;

    // ✅ Find agent
    const agent = await Agent.findOne({ agentId }).select("notAvailableDates");
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // ✅ Fetch meetings (already scheduled)
    const meetings = await Meeting.find({
      agentId,
      status: "Scheduled",
    })
      .select("date")
      .sort({ date: 1 })
      .lean();

    const meetingDates = meetings.map((m) => m.date.toISOString().split("T")[0]);

    // ✅ Combine all blocked dates
    const notAvailableDates = agent.notAvailableDates?.map((d) =>
      new Date(d).toISOString().split("T")[0]
    ) || [];

    const blockedDates = [...new Set([...meetingDates, ...notAvailableDates])];

    res.status(200).json({
      success: true,
      blockedDates,
      count: blockedDates.length,
    });
  } catch (error) {
    console.error("Error fetching agent meeting dates:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching agent schedule",
    });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const { meetingId } = req.params; // /api/meetings/:meetingId
    if (!meetingId) {
      return res.status(400).json({
        success: false,
        message: "Missing meeting ID",
      });
    }



    // Find the meeting by its public ID
    const meeting = await Meeting.findOne({ meetingPublic_Id: meetingId })
      .populate("client", "name email") // optional
      .populate("agent", "name email"); // optional

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Send response with location included
    res.status(200).json({
      success: true,
      meeting: {
        meetingPublic_Id: meeting.meetingPublic_Id,
        type: meeting.type,
        date: meeting.date,
        status: meeting.status,
        notes: meeting.notes,
        location: meeting.location, // important for frontend
        client: meeting.client,
        agentContacts: meeting.agentContacts,
        createdAt: meeting.cancelledAt,
        agentId: meeting.agentId,
      },
    });
  } catch (error) {
    console.error("❌ Get meeting by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.cancelTour = async (req, res) => {
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

// Rescheduleing 

exports.rescheduleMeetingOrTour = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { newDate, reason } = req.body;
    const userId = req.user?.id;

    if (!meetingId || !newDate) {
      return res.status(400).json({
        success: false,
        message: "Meeting ID and new date are required.",
      });
    }

    const parsedNewDate = new Date(newDate);
    if (isNaN(parsedNewDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format.",
      });
    }

    // 1️⃣ Find meeting
    const meeting = await Meeting.findOne({ meetingPublic_Id: meetingId })
      .populate("client", "Email userName")
      .populate("agent", "user");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    // 2️⃣ Authorization check
    const isAgent = meeting.agent.toString() === userId;
    const isUser = meeting.client.toString() === userId;

    if (!isAgent && !isUser) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reschedule this meeting.",
      });
    }

    // 3️⃣ Prevent rescheduling cancelled/completed meetings
    if (["Cancelled", "Completed"].includes(meeting.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule a ${meeting.status.toLowerCase()} meeting.`,
      });
    }

    // 4️⃣ Check for date conflicts
    const existingMeeting = await Meeting.findOne({
      agent: meeting.agent,
      date: parsedNewDate,
      status: "Scheduled",
    });

    if (existingMeeting) {
      return res.status(400).json({
        success: false,
        message: "This date/time is already booked with the agent.",
      });
    }

    // 5️⃣ Record history
    const oldDate = meeting.date;
    meeting.rescheduleHistory.push({
      oldDate,
      newDate: parsedNewDate,
      reason: reason || "No reason provided",
      rescheduledBy: userId,
    });

    meeting.rescheduleCount = (meeting.rescheduleCount || 0) + 1;
    meeting.date = parsedNewDate;
    meeting.status = "Scheduled";
    meeting.updatedAt = new Date();

    await meeting.save();

    // 6️⃣ Fetch agent info
    const agent = await Agent.findOne({ user: meeting.agent._id });
    const agentEmail = agent?.agentContacts?.email;
    const userEmail = meeting.client.Email;

    // 7️⃣ Prepare and send notification emails
    const formattedDate = parsedNewDate.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    if (isAgent) {
      // Email to User
      await sendEmail({
        to: userEmail,
        subject: "Your Tour Has Been Rescheduled 🏡",
        text: `
Hello ${meeting.client.userName},

Your scheduled property tour has been updated by your agent.

🗓️ New Date & Time: ${formattedDate}
💬 Reason: ${reason || "No reason provided"}

Please check your account for updated details.

Best regards,  
The Real Estate Team
        `,
      });
    } else if (isUser) {
      // Email to Agent
      await sendEmail({
        to: agentEmail,
        subject: "A Client Has Rescheduled Their Tour 📅",
        text: `
Hello ${agent.agentContacts.firstName},

Your client has requested to reschedule the tour.

🗓️ New Date & Time: ${formattedDate}
💬 Reason: ${reason || "No reason provided"}

Please review and confirm in your dashboard.

Best regards,  
The Real Estate Team
        `,
      });
    }

    // 8️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Meeting rescheduled successfully and notifications sent.",
      data: {
        meetingPublic_Id: meeting.meetingPublic_Id,
        oldDate,
        newDate: parsedNewDate,
        rescheduleCount: meeting.rescheduleCount,
      },
    });
  } catch (error) {
    console.error("❌ Reschedule error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};