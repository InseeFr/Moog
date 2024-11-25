import {
  URL_BACK_END,
  URL_SITE_MIRROIR,
  URL_COLEMAN_PROMOTION,
} from "actions/constants/url";

const reducer = (state = {}, action) => {
  const { type, payload: url } = action;
  switch (type) {
    case URL_BACK_END:
      return { ...state, linkBack: url };
    case URL_SITE_MIRROIR:
      return { ...state, linkQuestionnaire: url };
    case URL_COLEMAN_PROMOTION:
      return { ...state, urlColemanPromotion: url };
    default:
      return state;
  }
};

export default reducer;
