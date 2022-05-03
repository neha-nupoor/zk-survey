//** React Imports
import { useEffect } from 'react'
import {
    getIdentityCommitments,
    connectSemaphoreContract,
    packProof,
    broadcastSignal,
    voteOption
} from "../services/logic"
import { handleError, handleLoading, handleSuccess } from "../components/alert/alert"
import { retrieveId, hasIdentityCreated } from "../utils/storage"
import { calculateNPSScore, calculateNPSDetractors, calculateNPSPassives, calculateNPSPromoters, getTotalVotesCount } from "../utils/nps"
import {constants} from "../constants/constants"

export const useGetSurveys = () => {
    const [surveys, setData] = useState(() => {
        return [];
      });
      // Return a wrapped version of useState's setter function that ...
      // ... persists the new value to localStorage.
      const setSurveys = (value) => {
        try {
          // Allow value to be a function so we have same API as useState
          const valueToStore =
            value instanceof Function ? value(surveys) : value;
          // Save state

            
            setSurveys(valueToStore)
            // const ZERO_VALUE = constants.ZERO_VALUE
           
        } catch (error) {
          // A more advanced implementation would handle the error case
          console.log(error);
        }
      };
      return [surveys, setSurveys];
}