import { URL_BACK_END, URL_SITE_MIRROIR, URL_COLEMAN_PROMOTION } from './constants/url';

export const saveUrlBackEnd = url => ({
  type: URL_BACK_END,
  payload: url,
});
export const saveUrlSiteMirroir = url => ({
  type: URL_SITE_MIRROIR,
  payload: url,
});
export const saveUrlColemanPromotion = url => ({
  type: URL_COLEMAN_PROMOTION,
  payload: url,
});
