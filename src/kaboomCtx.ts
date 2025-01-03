import kaboom from "kaboom";
import { scale } from "./constant";

export const k=kaboom({
	width:256*scale,
	height:144*scale,
	scale,
	letterbox:true,
	global:false,

})