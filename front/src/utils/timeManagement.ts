
const timeManagement = (d: any, dayOfWeek: number, daySkipper: number)=> {
    d = new Date(d);
    const day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:dayOfWeek + daySkipper); // adjust when day is sunday
        new Date(d.setDate(diff));

        let date = d.getDate();
        let month = d.getMonth(); 
        let year = d.getFullYear();

        const monthNames = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];
        
        const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        
        const dateWithFullMonthName = daysOfWeek[d.getDay()] + " " + date + " " + monthNames[month] + " " + year

        let formatForReservation = year + '-' + ('0' + (month + 1)).slice(-2) + '-' + ('0' + date).slice(-2);

        return {
          dateWithFullMonthName,
          day: daysOfWeek[d.getDay()] + " " + date,
          month: monthNames[month] + " " + year,
          formatForReservation
        };
    
  };

export default timeManagement