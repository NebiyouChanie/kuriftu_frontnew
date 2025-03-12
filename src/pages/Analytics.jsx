import TopLoyalCustomers from '@/components/analytics/LoyalCustomers'
import MostOrderedFoods from '@/components/analytics/MostOrderedFoods'
import OrdersByTimeAndType from '@/components/analytics/OrdersPerTime'
import TopLocations from '@/components/analytics/TopLocations'
import React from 'react'
 
 function Analytics() {
   return (
     <div>
      <OrdersByTimeAndType />
      <TopLocations />
      <MostOrderedFoods />
      <TopLoyalCustomers />
     </div>
   )
 }
 
 export default Analytics
 