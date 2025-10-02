import { environment } from "../environment/environment";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
interface Agg { value: string; viewValue: string; }
interface AggGroup { disabled?: boolean; name: string; agg: Agg[]; }

export class MyUtils {
    HOST = environment.host;
    pokemonGroups: AggGroup[] = [];
    _getPlant_menu()  {
        const uploadUrl = `${this.HOST}/api/agg/plant/`;
        fetch(uploadUrl, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json()).
            then(res => {
                this.pokemonGroups = res.data[0]
            }).catch((err) => {
                console.log(err)
            })
    }
}

