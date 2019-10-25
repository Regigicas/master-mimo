let nombreConductor = "Juan Antonio";
let nombreCapitan = "Francisco";

function ejercicio1()
{
    console.log("El nombre del conductor es " + nombreConductor);
    console.log("El nombre del capitán es " + nombreCapitan);
}

function ejercicio2()
{
    if (nombreConductor.length > nombreCapitan.length)
        console.log("El nombre del conductor es más largo, tiene " + nombreConductor.length + " caracteres");
    else if (nombreConductor.length < nombreCapitan.length)
        console.log("El nombre del capitán es más largo, tiene " + nombreCapitan.length + " caracteres");
    else
        console.log("El conductor y el capitán tienen " + nombreConductor.length + " caracteres en su nombre");
}

function ejercicio3()
{
    console.log(nombreConductor.toUpperCase().split("").join(" "));
    console.log(nombreCapitan.split("").reverse().join(""));

    if (nombreConductor > nombreCapitan)
        console.log("El nombre del conductor va primero");
    else if (nombreConductor < nombreCapitan)
        console.log("El nombre del capitán va primero");
    else
        console.log("¡Se llaman igual!");
}

function ejercicio4()
{
    let texto = "\
    \
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam placerat lacus sed magna consectetur aliquet. Donec bibendum, dui ut pellentesque tincidunt, ligula metus interdum ipsum, a dignissim enim massa eget lacus. Fusce at auctor nibh, vel interdum ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris commodo tortor non augue dictum rutrum. Donec a augue mi. Nullam cursus lacinia odio, ac sagittis ante blandit vel. Nulla efficitur ipsum et est pretium suscipit. Donec lobortis nibh varius varius finibus. Fusce congue lobortis orci, at blandit neque dapibus nec. Curabitur facilisis libero quis mauris fermentum, nec viverra urna tristique. Etiam varius magna ut nisi finibus, in iaculis dui condimentum. Cras auctor pellentesque leo, eu dictum magna consequat at. Proin placerat tellus vitae orci interdum vehicula. Nulla et vulputate magna.\
    \
    Sed convallis magna at pharetra rutrum. In hac habitasse platea dictumst. Pellentesque diam risus, placerat quis vehicula at, facilisis vitae felis. Phasellus interdum euismod commodo. Sed purus ex, aliquet ac nulla in, vestibulum consectetur purus. Sed eget pulvinar erat. Ut commodo augue nibh, et porttitor enim pharetra vehicula. Curabitur nec lobortis urna. Nam mauris sapien, condimentum sit amet leo ut, tempor fermentum urna. In hac habitasse platea dictumst.\
    \
    Fusce dictum ipsum id lacus suscipit scelerisque. Pellentesque efficitur, felis id sollicitudin eleifend, orci lorem dignissim magna, ac volutpat sem justo non elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non erat ultrices, viverra tellus ac, tempor ligula. Suspendisse a consectetur ipsum. Donec non imperdiet leo.\
    \
    Sed a nisi felis. Donec mollis, neque a ornare tristique, ligula sem consectetur leo, sed mattis augue erat in ex. Ut non augue malesuada, posuere sapien eget, facilisis risus. Nulla condimentum elit nec blandit vehicula. In eu purus ut ante volutpat lacinia sit amet vel massa. Aliquam semper ante justo, vitae commodo libero porttitor a. Nunc eget rhoncus velit. Sed id augue tincidunt orci cursus feugiat. Duis enim mi, consequat sed efficitur sit amet, blandit a sem. Nulla bibendum dignissim mi vitae ornare. Donec quis elit dui. Nulla pretium felis felis, vitae pharetra ex imperdiet eget. Mauris maximus, ante sit amet dapibus iaculis, erat odio sollicitudin risus, eu elementum massa diam quis ipsum. Etiam hendrerit velit eget velit luctus, sed sollicitudin sem iaculis. Vestibulum placerat elit venenatis leo blandit, at lobortis lorem fringilla.\
    \
    Nam rhoncus ante ac ligula molestie, eget ultricies orci blandit. Praesent mauris justo, ultrices id bibendum vel, mollis at sapien. Duis eleifend accumsan laoreet. Nulla tellus justo, consectetur et felis vel, placerat iaculis nibh. Nulla eleifend nunc in nibh efficitur posuere. Etiam a sem quis nunc ornare molestie quis quis mi. Nulla non ornare mauris, ut laoreet magna. Maecenas in lorem rutrum, scelerisque nibh eget, pharetra dolor."

    console.log("Número de palabras: " + texto.split(" ").length);
    console.log("Número de veces que aparece 'et': " + (texto.match(/ et /g) || []).length)
}

ejercicio1();
ejercicio2();
ejercicio3();
ejercicio4();
