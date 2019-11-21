/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rssdom;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Scanner;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONML;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 *
 * @author Regigicas
 */
public class RSSMain
{
    private static String tempFileDataName = "data_temp.xml";
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args)
    {
        RSSMain rss = new RSSMain();
    }
    
    public RSSMain() 
    {
        try 
        {
           procesar();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }
    
    public static void procesar() throws
         ParserConfigurationException,IOException, SAXException, 
                                        TransformerConfigurationException, 
                                        TransformerException, JSONException 
    {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Introduce la URL de la RSS: ");
        String datosURL = scanner.nextLine();
        System.out.println("Procesando RSS desde '" + datosURL + "'");
        ObtenerXMLRSS(datosURL);
        Document doc = GenerarDOM(tempFileDataName);
        
        GenerarSalidaXML(doc); // Tambien llama a generar JSON para convertir el xml de salida a JSON directamente
        
        File tempFile = new File(tempFileDataName);
        tempFile.delete();
    }
    
    static void ObtenerXMLRSS(String datosURL) throws MalformedURLException, FileNotFoundException, IOException
    {
        URL u = new URL(datosURL);
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(tempFileDataName, false));
            BufferedReader reader = new BufferedReader(new InputStreamReader(u.openStream())))
        {
            String line;
            while ((line = reader.readLine()) != null)
                writer.write(line + "\n");

            writer.flush();
        }
    }
    
    static Document GenerarDOM(String fichero) throws ParserConfigurationException, IOException, SAXException 
    {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        dbf.setIgnoringElementContentWhitespace(true);
        
        DocumentBuilder db = dbf.newDocumentBuilder();

        Document doc = db.newDocument();
        if (!fichero.equals(""))
            doc = db.parse(new File(fichero));

        return doc;
    }
    
    
    //Crear un fichero XML a partir de la información de un árbol DOM
    static void GenerarSalidaXML(Document doc_in) throws ParserConfigurationException, 
                                                           IOException, 
                                                           SAXException, 
                                                           TransformerConfigurationException, 
                                                           TransformerException,
                                                           JSONException {
        
        Document doc_out = GenerarDOM("");        
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();
        transformer.setOutputProperty(OutputKeys.VERSION, "1.0");
        transformer.setOutputProperty(OutputKeys.ENCODING, "ISO-8859-1");
        transformer.setOutputProperty(OutputKeys.STANDALONE, "yes");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");    
        
        String ficheroSalida = GenerarDOMSalida(doc_in, doc_out);
        ficheroSalida = CorregirNombreArchivo(ficheroSalida);

        transformer.transform(new DOMSource(doc_out), new StreamResult(new File(ficheroSalida + ".xml")));
        
        GenerarSalidaJSON(doc_out, ficheroSalida);
    }
    
    static String GenerarDOMSalida(Document doc_in, Document doc_out)
    {
        String nombreCanal = null;
        NodeList channels = doc_in.getElementsByTagName("channel");
        for (int i = 0; i < channels.getLength(); ++i)
        {
            Element chn = (Element)channels.item(i);
            Element titulo = (Element)chn.getElementsByTagName("title").item(0);
            Element url = (Element)chn.getElementsByTagName("link").item(0);
            Element descripcion = (Element)chn.getElementsByTagName("description").item(0);
            
            Element nuevoCanal = doc_out.createElement("noticias");
            nuevoCanal.setAttribute("canal", ObtenerContenidoNodo(titulo));
            nombreCanal = ObtenerContenidoNodo(titulo);
            
            System.out.println(String.format("Información del canal %s, url: %s, Descripción: %s\n Lista de noticias:", ObtenerContenidoNodo(titulo),
                    ObtenerContenidoNodo(url), ObtenerContenidoNodo(descripcion)));
            
            NodeList noticias = chn.getElementsByTagName("item");
            for (int j = 0; j < noticias.getLength(); ++j)
            {
                Element nodoNoticia = (Element)noticias.item(j);
                
                Element noticiaTitulo = (Element)nodoNoticia.getElementsByTagName("title").item(0);
                Element noticiaURL = (Element)nodoNoticia.getElementsByTagName("link").item(0);
                Element noticiaDescripcion = (Element)nodoNoticia.getElementsByTagName("description").item(0);
                Element noticiaPubDate = (Element)nodoNoticia.getElementsByTagName("pubDate").item(0);
                Element noticiaCategoria = (Element)nodoNoticia.getElementsByTagName("category").item(0); // En las RSS de elmundo no existe category en algunas noticias
                
                Element nuevaNoticia = doc_out.createElement("noticia");
                nuevaNoticia.setTextContent(ObtenerContenidoNodo(noticiaTitulo));
                nuevoCanal.appendChild(nuevaNoticia);
                
                System.out.println(String.format("  - %s, url: %s, Descripción: %s, Fecha de publicación: %s, Categoría: %s", ObtenerContenidoNodo(noticiaTitulo),
                        ObtenerContenidoNodo(noticiaURL), ObtenerContenidoNodo(noticiaDescripcion), ObtenerContenidoNodo(noticiaPubDate),
                        noticiaCategoria != null ? ObtenerContenidoNodo(noticiaCategoria) : ""));
            }
            
            doc_out.appendChild(nuevoCanal);
        }
        
        return "noticias_" + nombreCanal;
    }
    
    static String ObtenerContenidoNodo(Element elem)
    {
        return elem.getChildNodes().item(0).getNodeValue();
    }
    
    static public String CorregirNombreArchivo(String inputName)
    {
        return inputName.replaceAll("[^a-zA-Z0-9-_\\.]", "_");
    }
    
    private static void GenerarSalidaJSON(Document doc_out, String ficheroSalida) throws JSONException, IOException
    {
        JSONObject json = new JSONObject();
        NodeList nodosNoticias = doc_out.getElementsByTagName("noticias");
        for (int i = 0; i < nodosNoticias.getLength(); ++i)
        {
            Element chn = (Element)nodosNoticias.item(i);
            json.put("canal", chn.getAttribute("canal"));
            JSONArray array = new JSONArray();
            
            NodeList noticias = chn.getElementsByTagName("noticia");
            for (int j = 0; j < noticias.getLength(); ++j)
            {
                Element nodoNoticia = (Element)noticias.item(j);
                JSONObject nodoJSON = new JSONObject();
                nodoJSON.put("noticia", ObtenerContenidoNodo(nodoNoticia));
                array.put(nodoJSON);
            }
            
            json.put("noticias", array);
        }
        
        try (FileWriter file = new FileWriter(ficheroSalida + ".json", false))
        {
            file.write(json.toString());
        }
    }
}
