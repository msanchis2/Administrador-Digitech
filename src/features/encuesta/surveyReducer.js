export const initialSurvey = { step: 1, colectivo: null, profesor: null, unit: null, ratings: {}, done: false };

export function surveyReducer(state, action) {
  switch (action.type) {
    case "colectivo":
      return { ...state, colectivo: action.value, ratings: {}, unit: null };
    case "profesor":
      return { ...state, profesor: action.value, unit: null };
    case "unit":
      return { ...state, unit: action.value };
    case "rate":
      return { ...state, ratings: { ...state.ratings, [action.item]: action.value } };
    case "step":
      return { ...state, step: action.value };
    case "done":
      return { ...state, done: true };
    case "reset":
      return initialSurvey;
    default:
      return state;
  }
}
