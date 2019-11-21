/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rsssax;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Scanner;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;
import javax.xml.transform.stream.StreamResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

/**
 *
 * @author Regigicas
 */
public class RSSSax
{
    private static String tempFileDataName = "data_temp.xml";
    
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) 
            throws SAXException, ParserConfigurationException, IOException, 
            TransformerConfigurationException, TransformerException, JSONException
    {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Introduce la URL de la RSS: ");
        String datosURL = scanner.nextLine();
        System.out.println("Procesando RSS desde '" + datosURL + "'");
        ObtenerXMLRSS(datosURL);
        
        SAXParserFactory saxParserFactory = SAXParserFactory.newInstance();
        saxParserFactory.setNamespaceAware(true);
        SAXParser saxParser = saxParserFactory.newSAXParser();

        RSSHandler rssHandler = new RSSHandler(saxParser.getXMLReader());  
        String fileName = ParsearXML(saxParser, rssHandler);
        fileName = CorregirNombreArchivo(fileName);
        GenerarXMLSalida(rssHandler, fileName);
        GenerarSalidaJSON(rssHandler, fileName);
        
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
    
    public static String ParsearXML(SAXParser saxParser, RSSHandler rssHandler) throws SAXException, IOException, ParserConfigurationException
    {
        String nombreCanal = null;
        File xmlFile = new File(tempFileDataName);
        saxParser.parse(xmlFile, rssHandler);
        
        for (Canal canal : rssHandler.getCanales())
        {
            nombreCanal = canal.getTitle();
            System.out.println(String.format("Información del canal %s, url: %s, Descripción: %s\n Lista de noticias:", canal.getTitle(),
                    canal.getLink(), canal.getDescription()));
            
            for (Noticia noticia : canal.getItem())
            {
                System.out.println(String.format("  - %s, url: %s, Descripción: %s, Fecha de publicación: %s, Categoría: %s", noticia.getTitle(),
                        noticia.getLink(), noticia.getDescription(), noticia.getPubDate(),
                        noticia.getCategory() != null ? noticia.getCategory() : ""));
            }
        }
        
        return "noticias_" + nombreCanal;
    }
    
    static public String CorregirNombreArchivo(String inputName)
    {
        return inputName.replaceAll("[^a-zA-Z0-9-_\\.]", "_");
    }
    
    static void GenerarXMLSalida(RSSHandler rssHandler, String fileSalida) throws ParserConfigurationException, 
                                                           IOException, 
                                                           SAXException, 
                                                           TransformerConfigurationException, 
                                                           TransformerException
    {     
        SAXTransformerFactory saxTransformerFactory = (SAXTransformerFactory)SAXTransformerFactory.newInstance();
        TransformerHandler transformerHandler = saxTransformerFactory.newTransformerHandler();
        
        Transformer transformer = transformerHandler.getTransformer();
        transformer.setOutputProperty(OutputKeys.VERSION, "1.0");
        transformer.setOutputProperty(OutputKeys.ENCODING, "ISO-8859-1");
        transformer.setOutputProperty(OutputKeys.STANDALONE, "yes");
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");    
        
        File f = new File(fileSalida + ".xml");
        try (FileOutputStream fileWriter = new FileOutputStream(f);
             Writer writer = new BufferedWriter(new OutputStreamWriter(fileWriter, StandardCharsets.UTF_8));)
        {
            Result result = new StreamResult(writer);
            transformerHandler.setResult(result);
            
            AttributesImpl atts = new AttributesImpl();
            
            transformerHandler.startDocument();
            

            for (Canal canal : rssHandler.getCanales())
            {
                atts.clear();
                atts.addAttribute("", "", "canal", "String", canal.getTitle());
                transformerHandler.startElement("", "", "noticias", atts);
                atts.clear();
            
                for (Noticia noticia : canal.getItem())
                {
                    transformerHandler.startElement("", "", "noticia", atts);
                    transformerHandler.characters(noticia.getDescription().toCharArray(), 0, noticia.getDescription().length());
                    transformerHandler.endElement("", "", "noticia");
                }
               
                transformerHandler.endElement("", "", "noticias");
            }

            transformerHandler.endDocument();
            
            writer.flush();
        }
    }
    
    private static void GenerarSalidaJSON(RSSHandler rssHandler, String ficheroSalida) throws JSONException, IOException
    {
        JSONObject json = new JSONObject();
        for (Canal canal : rssHandler.getCanales())
        {
            json.put("canal", canal.getTitle());
            JSONArray array = new JSONArray();

            for (Noticia noticia : canal.getItem())
            {
                JSONObject nodoJSON = new JSONObject();
                nodoJSON.put("noticia", noticia.getDescription());
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
