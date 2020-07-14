
const Apartment = require('../models/apartments');

exports.getAllApartments = async (req, res) => {
  
    const apartments = await Apartment.find();

    apartments.sort ((a, b) => {
        return a.price - b.price;
    });

    console.log("Apartamentos recuperados: ", apartments);
    
    res.render('index', {
        apartments: apartments,
        isAdmin: false,
        foundApartments: true
    });
}

exports.postSelectedApartments = async (req, res) => {

    const checkIn = req.body.CheckIn;
    const checkOut = req.body.CheckOut;
    const province = req.body.province;
    const city = req.body.city;
    const maxPrice = req.body.maxPrice;
    const minPrice = req.body.minPrice;
    const occupancy = req.body.occupancy;

    const checkInDate = new Date(checkIn).getTime();
    const checkOutDate = new Date(checkOut).getTime();

    let searchCriteria = {occupancy: {$gte: occupancy}, 'location.province': province, 'location.city': city, price: {$lte: maxPrice, $gte: minPrice}};
    const possibleApartments = await Apartment.find(searchCriteria);
    let apartments = [];

    possibleApartments.forEach((apartment) => {

        let arrayReservations = apartment.reservations;
        let evaluator = true;

        arrayReservations.forEach((reserve) => {                                                           // ¿usar funcion some?
            if ((reserve.start.getTime() <= checkInDate && checkInDate <= reserve.end.getTime())
             || (reserve.start.getTime() <= checkOutDate && checkOutDate <= reserve.end.getTime())
             || (reserve.start.getTime() >= checkInDate && checkOutDate >= reserve.end.getTime())) {
                evaluator = false;
            }
        });

        if (evaluator) apartments.push(apartment);
        
    });

    apartments.sort ((a, b) => {
        return a.price - b.price;
    });

    console.log ("Escogidos", apartments, apartments.length);

    if (apartments.length > 0) {

        res.render('index', {

            apartments: apartments,
            isAdmin: false,
            foundApartments: true
        });

    } else {

        res.render('index', {

            isAdmin: false,
            foundApartments: false
        });
    }    
}

exports.getDetailedApartment = async (req, res) => {
    
    let idApartment = req.params.idApartment.substr(1);
    console.log("Identificador del apartamento: ", idApartment);

    const apartment = await Apartment.findOne({_id: idApartment});
    console.log("Apartamento recuperado: ", apartment);

    res.render('details', {
        apartment: apartment,
        isAdmin: false
    });
}

exports.postNewReservation = async (req, res) => {

    let idApartment = req.params.idApartment.substr(1);

    const checkIn = req.body.CheckIn;
    const checkOut = req.body.CheckOut;
    const adults = req.body.Adults;
    const kids = req.body.Kids;

    const checkInDate = new Date(checkIn).getTime();
    const checkOutDate = new Date(checkOut).getTime();

    if (checkOutDate <= checkInDate) {
        res.render('reservation', {
            error: 1
        });
        return;
    }

    Apartment.findById(idApartment).then(apartment => {

        let arrayReservations = apartment.reservations;
        let evaluatorDates = true;
        let pax = Number(adults) + Number(kids);

        console.log("Datos:", pax, apartment.occupancy)

        if (apartment.occupancy < pax) {
            //evaluatorOccupancy = false;
            res.render('reservation', {
                error: 2
            });
            return;
        }

        arrayReservations.forEach((reserve) => {
            if ((reserve.start.getTime() <= checkInDate && checkInDate <= reserve.end.getTime())
             || (reserve.start.getTime() <= checkOutDate && checkOutDate <= reserve.end.getTime())
             || (reserve.start.getTime() >= checkInDate && checkOutDate >= reserve.end.getTime())) {
                evaluatorDates = false;
            }
        });

        if (evaluatorDates){
            apartment.reservations.push({start: checkIn, end: checkOut, adults: adults, kids: kids});
            apartment.save();
            res.render('reservation', {
                checkIn: checkIn,
                checkOut: checkOut,
                error: 0                
            });
  
        } else {
            res.render('reservation', {               
                error: 3     
            });
        }
    });
}
