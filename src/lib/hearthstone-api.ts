import axios from "axios";
import { RAPID_API_KEY } from "$env/static/private";

const hearthstone = axios.create({
  baseURL: "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards",
  headers: {
    "X-RapidAPI-Key": RAPID_API_KEY,
    "X-RapidAPI-Host": "omgvamp-hearthstone-v1.p.rapidapi.com"
  }
});

export default hearthstone;
