'use strict';

/**
 * usage router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::usage.usage');
