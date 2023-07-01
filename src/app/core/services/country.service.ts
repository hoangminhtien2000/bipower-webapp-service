import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class CountryService {
    DEFAULT_COUNTRY_KEY = 'Vietnam';
    DEFAULT_COUNTRY_LABEL = 'Việt Nam';
    public COUNTRY = ["Finland", "Guatemala", "Chile", "Uruguay", "Kyrgyzstan", "Zambia", "Niue", "Austria", "Georgia", "Trinidad and Tobago", "South Korea", "United States Minor Outlying Islands", "French Guiana", "Mali", "North Macedonia", "Fiji", "Madagascar", "Dominica", "Nauru", "Costa Rica", "Palau", "Algeria", "Nicaragua", "Zimbabwe", "Rwanda", "Turkey", "Monaco", "Tajikistan", "Cocos (Keeling) Islands", "Jamaica", "Latvia", "Saint Helena, Ascension and Tristan da Cunha", "Aruba", "Pakistan", "Belarus", "Solomon Islands", "Eswatini", "New Caledonia", "Mexico", "Guernsey", "Liechtenstein", "Botswana", "Saint Vincent and the Grenadines", "Åland Islands", "Israel", "Guinea", "North Korea", "Philippines", "Guadeloupe", "Tunisia", "Central African Republic", "Nigeria", "Greece", "Jersey", "Palestine", "Ivory Coast", "Northern Mariana Islands", "Comoros", "Togo", "Lesotho", "United States Virgin Islands", "Saint Kitts and Nevis", "Marshall Islands", "Equatorial Guinea", "Indonesia", "Canada", "Armenia", "Falkland Islands", "Panama", "Guam", "Egypt", "Malta", "Laos", "Azerbaijan", "Turks and Caicos Islands", "Saint Lucia", "Cambodia", "Tokelau", "Cuba", "São Tomé and Príncipe", "Antigua and Barbuda", "Grenada", "Serbia", "Chad", "Sri Lanka", "Western Sahara", "Burkina Faso", "Ireland", "Martinique", "Qatar", "Sierra Leone", "Slovakia", "Montenegro", "Iceland", "Gambia", "Guyana", "Morocco", "Sint Maarten", "Sweden", "Tuvalu", "United Arab Emirates", "Venezuela", "Samoa", "Lebanon", "Benin", "United States", "Tonga", "Curaçao", "Isle of Man", "Bosnia and Herzegovina", "Haiti", "Seychelles", "Tanzania", "Faroe Islands", "Eritrea", "Ethiopia", "Norfolk Island", "Mongolia", "Germany", "Vatican City", "Cameroon", "Nepal", "South Africa", "Syria", "San Marino", "Brunei", "Italy", "South Sudan", "Portugal", "Iraq", "Mayotte", "Luxembourg", "Saint Martin", "Albania", "Uganda", "Bhutan", "Wallis and Futuna", "Namibia", "Réunion", "Spain", "Oman", "Bangladesh", "Djibouti", "Taiwan", "Mauritius", "Svalbard and Jan Mayen", "Thailand", "Honduras", "Paraguay", "Liberia", "Slovenia", "Somalia", "Gibraltar", "New Zealand", "British Virgin Islands", "Bahamas", "Malawi", "Saudi Arabia", "Guinea-Bissau", "Ecuador", "Timor-Leste", "Switzerland", "Libya", "Senegal", "Bolivia", "Australia", "Papua New Guinea", "Barbados", "Republic of the Congo", "Kosovo", "French Polynesia", "Lithuania", "Bulgaria", "Sudan", "Saint Barthélemy", "Turkmenistan", "Myanmar", "Brazil", "Colombia", "Heard Island and McDonald Islands", "Iran", "Moldova", "Montserrat", "Denmark", "Macau", "Norway", "Cape Verde", "Japan", "Bahrain", "Cyprus", "Gabon", "Niger", "Cook Islands", "Maldives", "Andorra", "Dominican Republic", "Singapore", "DR Congo", "South Georgia", "Bouvet Island", "El Salvador", "Yemen", "Ukraine", "France", "China", "Peru", "Saint Pierre and Miquelon", "Suriname", "Pitcairn Islands", "Afghanistan", "Hungary", "United Kingdom", "Mauritania", "American Samoa", "Estonia", "Kuwait", "French Southern and Antarctic Lands", "India", "Netherlands", "Jordan", "Caribbean Netherlands", "Cayman Islands", "Malaysia", "Ghana", "Puerto Rico", "Croatia", "Czechia", "Uzbekistan", "Burundi", "British Indian Ocean Territory", "Christmas Island", "Belize", "Kenya", "Antarctica", "Kazakhstan", "Argentina", "Hong Kong", "Micronesia", "Romania", "Kiribati", "Vanuatu", "Angola", "Anguilla", "Poland", "Belgium", "Mozambique", "Bermuda", "Russia", "Greenland"]

    public getAllCountry() : Observable<string[]> {
        return of(this.COUNTRY);
    }

    public getAllMapValueLabel(): {value: string, label: string}[] {
        let nationalityList = this.COUNTRY.map(el => {
            return {
                value: el,
                label: el
            }
        });
        nationalityList.push({
            value: this.DEFAULT_COUNTRY_KEY,
            label: this.DEFAULT_COUNTRY_LABEL
        });
        nationalityList.sort(function(a, b) {
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
        });
        return nationalityList;
    }

}
