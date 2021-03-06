import {initOtherinfoData} from './initialStates';
import update from 'immutability-helper';

// import produce from "immer";
const otherinfoData = (state = initOtherinfoData, action) => {
  switch (action.type) {
    case 'GET_USER_DETAIL_SUCCEED':
      /**A work around for saving overweight limit here */
      const overweight = action.user.config.filter((item) => item.field === 'overweight_limit');
      return {
        ...state,
        overWeightLimit: overweight[0].value,
      };
    case 'SET_VIEW_CONSIGNMENT':
      return {
        ...state,
        ...action.payload.OtherInfoData,
      };
    case 'SET_OTHERINFO_INPUT':
      if (action.key === 'serviceData') {
        const rfg = action.payload.filter(
          (service) => service.service_code === 'REG',
        );
        return {
          ...state,
          service: rfg.length > 0 ? 'REG' : '',
          [action.key]: action.payload,
        };
      }
      if (action.key === 'otherSurcharges') {
        let adtSurcharge = state.adtSurcharge.filter(
          (item, index) => item !== state.otherSurcharges,
        );
        return {
          ...state,
          otherSurcharges: action.payload,
          adtSurcharge: adtSurcharge.concat(action.payload),
        };
      }
      if (action.key === 'adtSurcharge') {
        return {
          ...state,
          [action.key]: (state.adtSurcharge || []).concat(action.payload),
        };
      } else {
        if (
          action.key === 'berat' ||
          action.key === 'lebar' ||
          action.key === 'panjang' ||
          action.key === 'tinggi'
        ) {
          let totalWeight = false;
          state.koli.map((item, index) => {
            totalWeight = totalWeight + (index === action.payload.index ? parseFloat(action.payload.val) : item.berat);
            return item;
          });
          return update(state, {
            koli: {
              [action.payload.index]: {
                [action.key]: {$set: parseFloat(action.payload.val)},
              },
            },
            overWeight: {$set: state.overWeightLimit < totalWeight || false},
          });
        } else if (action.key === 'changepcs') {
          let arrPcs = state.koli;
          if (arrPcs.length < action.payload) {
            for (var i = arrPcs.length; i < action.payload; i++) {
              arrPcs.push({id: i, berat: 1, panjang: 10, lebar: 10, tinggi: 10});
            }
          } else {
            arrPcs.splice(action.payload);
          }
          let totalWeight = false;
          arrPcs.map((item, index) => {
            totalWeight = totalWeight + item.berat;
            return item;
          });
          return {
            ...state,
            koli: arrPcs,
            overWeight: state.overWeightLimit < totalWeight || false,
          };
        } else {
          return {
            ...state,
            [action.key]: action.payload,
          };
        }
      }
    case 'REMOVE_SURCHARGE_ITEMS':
      return {
        ...state,
        adtSurcharge: state.adtSurcharge.filter(
          (item, index) => item !== action.item,
        ),
      };
    case 'RESET_FORM':
    case 'RESET_ALL_FORM':
      return {
        ...initOtherinfoData,
      };
    default:
      return state;
  }
};
export default otherinfoData;
