const mongoose = require('mongoose');
const { Schema } = mongoose;


const wishlistSchema = new Schema(
  {
    // Reference to the user who owns this wishlist
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Listings saved by the user
    listings: [
      {
        listing: {
          type: Schema.Types.ObjectId,
          ref: 'Listing',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          trim: true,
          maxlength: 300, // Optional note the user can leave
        },
      },
    ],

    // Optional grouping of wishlists (future-proofing)
    name: {
      type: String,
      trim: true,
      default: 'My Wishlist',
      maxlength: 100,
    },

    // Visibility control (for shared wishlists)
    visibility: {
      type: String,
      enum: ['private', 'shared'],
      default: 'private',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🧠 Ensure a listing isn't added twice for the same user
wishlistSchema.index({ user: 1, 'listings.listing': 1 }, { unique: true });
wishlistSchema.index({ "listings.addedAt": -1 });
// 🧩 Virtual populate: count total saved listings
wishlistSchema.virtual('totalListings').get(function () {
  return this.listings.length;
});

// 🧹 Pre hook cleanup (optional): remove wishlist when user is deleted
// wishlistSchema.pre('remove', async function (next) {
//   await mongoose.model('Listing').updateMany(
//     { _id: { $in: this.listings.map((item) => item.listing) } },
//     { $pull: { favorites: this._id } }
//   );
//   next();
// });

module.exports = mongoose.model('Wishlist', wishlistSchema);
