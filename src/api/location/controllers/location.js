'use strict';

/**
 * location controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::location.location', ({ strapi }) => ({
  async find(ctx) {
    // some custom logic here
    ctx.query = {
      ...ctx.query,
      // deeply populate all relations
      'populate[usages][populate][media][populate]': '*',
      'populate[coordinates][populate]': '*',
    };

    // Calling the default core action
    let { data, meta } = await super.find(ctx);

    // Remove some attributes
    data = data.map(sanitizeLocation);

    return { data, meta };
  },
}));

function sanitizeLocation(location) {
  location = removeSystemProperties(location);
  location.attributes.usages.data = location.attributes.usages.data.map(sanitizeUsage);
  location.attributes.coordinates = removeSystemProperties(location.attributes.coordinates);
  return location;
}

function sanitizeUsage(usage) {
  usage = removeSystemProperties(usage);
  usage.attributes.media.data = usage.attributes.media.data.map(sanitizeMedia);
  return usage;
}

function sanitizeMedia(media) {
  media = removeSystemProperties(media);
  media.attributes.medium.data = sanitizeMedium(media.attributes.medium.data);
  return media;
}

function sanitizeMedium(medium) {
  medium = removeSystemProperties(medium);
  delete medium.attributes.name;
  delete medium.attributes.alternativeText;
  delete medium.attributes.caption;
  delete medium.attributes.width;
  delete medium.attributes.height;

  delete medium.attributes.hash;
  delete medium.attributes.ext;
  delete medium.attributes.mime;
  delete medium.attributes.size;
  delete medium.attributes.url;
  delete medium.attributes.previewUrl;
  delete medium.attributes.provider;
  delete medium.attributes.provider_metadata;

  medium.attributes.formats = Object.fromEntries(
    Object.entries(medium.attributes.formats)
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

function removeSystemProperties(model) {
  delete model.id;

  if (model.attributes?.createdAt) {
    delete model.attributes.createdAt;
  }

  if (model.attributes?.updatedAt) {
    delete model.attributes.updatedAt;
  }

  return model;
}
