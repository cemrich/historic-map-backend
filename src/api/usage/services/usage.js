'use strict';

/**
 * usage service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::usage.usage');
