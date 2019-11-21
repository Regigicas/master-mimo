/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rsssax;

import java.util.List;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;

/**
 *
 * @author Regigicas
 */
public class RSSHandler extends DefaultHandler
{
    private static final String ELEMENT_CANALES = "channel";
    private static final String ELEMENT_ITEMS = "item";

    private CanalHandler canalHandler;
    private NoticiaHandler noticiaHandler;

    private List<Canal> canales;
    private List<Noticia> noticias;

    private XMLReader xmlReader;

    public RSSHandler (XMLReader xmlReader)
    {
        this.xmlReader = xmlReader;
        canalHandler = new CanalHandler(this);
        noticiaHandler = new NoticiaHandler(this);
    }

    @Override
    public void startElement(String uri,
                              String localName,
                              String qName,
                              Attributes att) throws SAXException
    {
        switch (qName)
        {
            case ELEMENT_CANALES:
                xmlReader.setContentHandler(canalHandler);
                canalHandler.startElement(uri, localName, qName, att);
                break;
            case ELEMENT_ITEMS:
                xmlReader.setContentHandler(noticiaHandler);
                noticiaHandler.startElement(uri, localName, qName, att);
                break;
            default:
                break;
        }
    }

    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException
    {
        switch (qName)
        {
            case ELEMENT_CANALES:
                this.canales = canalHandler.getCanales();
                break;
            case ELEMENT_ITEMS:
                this.noticias = noticiaHandler.getNoticias();
                break;
            default:
                break;
        }

    }

    public void restore()
    {
        this.xmlReader.setContentHandler(this);
    }
    
    public void restoreCanal(Noticia noticia)
    {
        this.xmlReader.setContentHandler(canalHandler);
        canalHandler.getCanalActual().addItem(noticia);
    }

    public List<Canal> getCanales()
    {
        return canales;
    }

    public List<Noticia> getNoticias()
    {
        return noticias;
    }

    @Override
    public void error(SAXParseException e) throws SAXException
    {
        e.printStackTrace();
    }
}
