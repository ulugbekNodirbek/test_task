import TableListBlock from "../container/table";
import { useState, useEffect } from "react";

const Home = () => {

    const [proArr, setProArr] = useState([])


    
    
    return ( 
        <div className="home-block container">
                <TableListBlock
                    proArr={proArr}
                    setProArr={setProArr}
                />
        </div>
     );
}
 
export default Home;