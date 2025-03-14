import React from "react"
import { Outlet } from "react-router-dom"
import Header from "./components/Header.jsx"

const Root = () => {
  return (
    <div className="relative">
      <Header/>
     <div className="">
        <Outlet/>
     </div>
      {/* Footer */}
    
    </div>
  )
}

export default Root