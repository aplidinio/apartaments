const Apartment = require('../models/apartments');
const { Mongoose } = require('mongoose');

exports.getNewApartment = (req, res) => {

    res.render('add-new', {
        editMode: false
    });
}

exports.postNewApartment = (req, res) => {

    const title = req.body.title;
    const price = req.body.price;
    const apartmentSize = req.body.apartmentSize;
    const occupancy = req.body.occupancy;

    const description = req.body.description;

    const doubleBeds = req.body.doubleBeds;
    const singleBeds = req.body.singleBeds;
    const additionalBeds = req.body.additionalBeds;

    let arrayBeds = []
    arrayBeds.push(
        { type: "Double", beds: doubleBeds },
        { type: "Single", beds: singleBeds, additionalBeds: additionalBeds }
    );

    const photoUrl = req.body.photoUrl;
    const photoTitle = req.body.photoTitle;
    const photoBoolean = [true, false, false, false];

    let arrayPhotos = []
    for (let i = 0; i < photoTitle.length; i++) {
        arrayPhotos.push({ title: photoTitle[i], url: photoUrl[i], mainPhoto: photoBoolean[i] });
    }

    const services = req.body.services;
    const rulesDescription = req.body.rulesDescription;
    const rulesIcons = req.body.rulesIcons;

    const rooms = req.body.rooms;
    const bathRooms = req.body.bathRooms;

    const province = req.body.province;
    const city = req.body.city;
    const GPSx = req.body.GPSx;
    const GPSy = req.body.GPSy;

    const location = {
        province: province,
        city: city,
        GPS: [GPSx, GPSy]
    }

    const reservations = []

    const newApartment = new Apartment({
        title: title,
        price: price,
        apartmentSize: apartmentSize,
        occupancy: occupancy,
        description: description,
        beds: arrayBeds,
        photos: arrayPhotos,
        services: services,
        rulesDescription: rulesDescription,
        rulesIcons: rulesIcons,
        rooms: rooms,
        bathRooms: bathRooms,
        location: location,
        reservations: reservations
    });

    newApartment.save()
        .then((result) => {
            res.redirect('/admin');
        })
        .catch(err => {
            console.log("Error!!! ", err);
            res - send("Ha ocurrido un error!!");
        });
}

exports.postEditApartment = (req, res) => {

    const title = req.body.title;
    const price = req.body.price;
    const apartmentSize = req.body.apartmentSize;
    const occupancy = req.body.occupancy;

    const description = req.body.description;

    const doubleBeds = req.body.doubleBeds;
    const singleBeds = req.body.singleBeds;
    const additionalBeds = req.body.additionalBeds;

    let arrayBeds = []
    arrayBeds.push(
        { type: "Double", beds: doubleBeds },
        { type: "Single", beds: singleBeds, additionalBeds: additionalBeds }
    );

    const photoUrl = req.body.photoUrl;
    const photoTitle = req.body.photoTitle;
    const photoBoolean = [true, false, false, false];

    let arrayPhotos = []
    for (let i = 0; i < photoTitle.length; i++) {
        arrayPhotos.push({ title: photoTitle[i], url: photoUrl[i], mainPhoto: photoBoolean[i] });
    }

    const services = req.body.services;
    const rulesDescription = req.body.rulesDescription;
    const rulesIcons = req.body.rulesIcons;

    const rooms = req.body.rooms;
    const bathRooms = req.body.bathRooms;

    const province = req.body.province;
    const city = req.body.city;
    const GPSx = req.body.GPSx;
    const GPSy = req.body.GPSy;

    const location = {
        province: province,
        city: city,
        GPS: [GPSx, GPSy]
    }

    const reservations = []
    const id = req.body._id;

    Apartment.findById(id).then(apartment => {

        apartment.title = title;
        apartment.price = price;
        apartment.apartmentSize = apartmentSize;
        apartment.occupancy = occupancy;
        apartment.description = description;
        apartment.beds = arrayBeds;
        apartment.photos = arrayPhotos;
        apartment.services = services;
        apartment.rulesDescription = rulesDescription;
        apartment.rulesIcons = rulesIcons;
        apartment.rooms = rooms;
        apartment.bathRooms = bathRooms;
        apartment.location = location;
        apartment.reservations = reservations;

        return apartment.save();
    })
        .then(result => {
            console.log("Apartamento actualizado");
            res.redirect(`/admin/apartment/:${id}`);
        })
        .catch(err => console.log("Ha habido un error", err));

}

exports.getAllApartments = async (req, res) => {

    const apartments = await Apartment.find();

    apartments.sort ((a, b) => {
        return a.price - b.price;
    });

    console.log("Apartamentos recuperados: ", apartments);
    res.render('index', {
        apartments: apartments,
        isAdmin: true,
        foundApartments: true
    });
}

exports.getDetailedApartment = async (req, res) => {

    let idApartment = req.params.idApartment.substr(1);
    console.log("Identificador del apartamento: ", idApartment);

    const apartment = await Apartment.findOne({ _id: idApartment });
    console.log("Apartamento recuperado: ", apartment);

    res.render('details', {
        apartment: apartment,
        isAdmin: true
    });
}

exports.getEditApartment = async (req, res) => {

    let idApartment = req.params.idApartment.substr(1);
    const apartment = await Apartment.findById(idApartment);

    res.render('add-new', {
        apartment: apartment,
        editMode: true  //para distinguir modo de edición del modo crear uno nuevo
    });
   
}

exports.getDeleteApartment = async (req, res) => {

    let idApartment = req.params.idApartment.substr(1);

    await Apartment.findByIdAndDelete(idApartment, (err) => {
        if (err) res.render("Apartamento no encontrado!");
        res.send(`<h1>Apartamento eliminado!</h1>
        '           <button type="button" onclick="window.close();"><a href="/admin/" style="text-decoration: none;">Cerrar</a>
        </button>`
        );
    });
}