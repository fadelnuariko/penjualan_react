import React from "react";
import Button from "@material-ui/core/Button"
import { useFirebase } from "../../../components/FirebaseProvider";



export default function Home() {
    const {auth} = useFirebase();
    return (
        <div>
            <h1>Halaman Buat Home</h1>
            <Button onClick={(e)=>{
                auth.signOut()
            }}>Sign Out</Button>
        </div>
    );
}
