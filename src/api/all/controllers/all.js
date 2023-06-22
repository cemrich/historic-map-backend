'use strict';

/**
 * A set of functions called "actions" for `all`
 */

module.exports = {

  async index(ctx, _) {
    try {
      const data = await strapi
        .service("api::all.all")
        .index();

      ctx.body = data;
    } catch (err) {
      ctx.badRequest("All index error", { moreDetails: err });
    }
  },

};
