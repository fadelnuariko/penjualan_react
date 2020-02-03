import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import Pengguna from "./pengguna";
import Toko from "./toko";

export default function Pengaturan() {
    return (
        <Switch>
            <Route path="/pengaturan/pengguna" component={Pengguna} />
            <Route path="/pengaturan/toko" component={Toko} />
            <Redirect to="/pengaturan/pengguna" />
        </Switch>
    );
}
