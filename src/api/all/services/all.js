'use strict';

/**
 * all service
 */

module.exports = () => ({

  index: async () => {

    try {
      // fetching data
      const locations = await strapi.entityService.findMany(
        "api::location.location",
        {
          populate: {
            usages: {
              populate: {
                media: {
                  populate: {
                    medium: {
                      fields: ["formats", "mime"],
                    },
                  }
                },
              }
            },
            coordinates: {
            }
          },
        }
      );

      const sanitizedLocations = locations.map(sanitizeLocation);

      return {
        locations: sanitizedLocations
      };
    } catch (err) {
      return err;
    }
  }

});


function sanitizeLocation(location) {
  location = removeSystemProperties(location);
  location.usages = location.usages.map(sanitizeUsage);
  location.coordinates = removeSystemProperties(location.coordinates);
  return location;
}

function sanitizeUsage(usage) {
  usage = removeSystemProperties(usage);
  usage.media = usage.media.map(sanitizeMedia);
  return usage;
}

function sanitizeMedia(media) {
  media = removeSystemProperties(media);
  const medium = media.medium;
  delete media.medium;
  media = { ...media, ...sanitizeMedium(medium) };
  return media;
}

function sanitizeMedium(medium) {
  medium = removeSystemProperties(medium);

  medium.formats = Object.fromEntries(
    Object.entries(medium.formats)
      .map(
        ([formatName, format]) => [formatName, sanitizeFormat(format)]
      )
  );

  return medium;
}

function sanitizeFormat(format) {
  delete format.name;
  delete format.hash;
  delete format.ext;
  delete format.mime;
  delete format.path;
  delete format.size;
  return format;
}

function removeSystemProperties(model, removeId = true) {
  if (removeId) {
    delete model.id;
  }

  if (model.createdAt) {
    delete model.createdAt;
  }

  if (model.updatedAt) {
    delete model.updatedAt;
  }

  return model;
}
