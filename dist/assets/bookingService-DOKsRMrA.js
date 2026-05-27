import{c as t,b as o}from"./index-HgVqHT6V.js";/**
 * @license lucide-react v1.7.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],e=t("map-pin",c),s={async createBooking(a){const{data:n}=await o.post("/bookings",a);return n},async getMyBookings(){const{data:a}=await o.get("/bookings/my");return a},async getAdminBookings(){const{data:a}=await o.get("/bookings/admin");return a}};export{e as M,s as b};
