/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rsssax;

import java.util.ArrayList;
import java.util.List;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

/**
 *
 * @author Regigicas
 */
public class NoticiaHandler extends DefaultHandler
{
    private static final String ELEMENT_ITEM = "item";
    private static final String ELEMENT_TITLE = "title";
    private static final String ELEMENT_LINK = "link";
    private static final String ELEMENT_DESCRIPTION = "description";
    private static final String ELEMENT_PUB_DATE = "pubDate";
    private static final String ELEMENT_CATEGORY = "category";

    private List<Noticia> noticias = new ArrayList<>();
    private Noticia currentNoticia;
    private StringBuilder buffer = new StringBuilder();
    private RSSHandler rssHandler;

    public NoticiaHandler(RSSHandler rssHandler)
    { 
        this.rssHandler = rssHandler;
    }
  
    @Override
    public void startElement(String uri, String localName, String qName, Attributes att)
    {
        if (!qName.equals(localName))
            return;
        
        switch (localName)
        {
            case ELEMENT_ITEM:
                currentNoticia = new Noticia();
                break;
            case ELEMENT_TITLE:
                buffer.delete(0, buffer.length());
                break;
            case ELEMENT_LINK:
                buffer.delete(0, buffer.length());
                break;
           case ELEMENT_DESCRIPTION:
                buffer.delete(0, buffer.length());
                break;
           case ELEMENT_PUB_DATE:
                buffer.delete(0, buffer.length());
                break;
           case ELEMENT_CATEGORY:
                buffer.delete(0, buffer.length());
                break;
            default:
                break;
        }
    }
    
    @Override
    public void characters(char[] ch, int start, int length) throws SAXException
    {
        buffer.append(ch,start, length);
    }
    
    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException
    {
        if (!qName.equals(localName))
            return;
        
        switch (localName)
        {
            case ELEMENT_ITEM:
                noticias.add(currentNoticia);
                rssHandler.endElement(uri, localName, qName);
                rssHandler.restoreCanal(currentNoticia);
                break;
            case ELEMENT_TITLE:
                currentNoticia.setTitle(buffer.toString());
                break;
            case ELEMENT_LINK:
                currentNoticia.setLink(buffer.toString());
                break;
           case ELEMENT_DESCRIPTION:
                currentNoticia.setDescription(buffer.toString().trim());
                break;
           case ELEMENT_PUB_DATE:
                currentNoticia.setPubDate(buffer.toString());
                break;
           case ELEMENT_CATEGORY:
                currentNoticia.setCategory(buffer.toString());
                break;
            default:
                break;
        }
    }
    
    public List<Noticia> getNoticias()
    {
        return noticias;
    }
}
