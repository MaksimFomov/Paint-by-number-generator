import { LOCALES } from "../i18n";

const SET_LANGUAGE = "SET_LANGUAGE";

const defaultState = {
  language: LOCALES.ENGLISH,
};

export default function reposReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    default:
      return state;
  }
}

export const setLanguage = (language) => ({
  type: SET_LANGUAGE,
  payload: language,
});
