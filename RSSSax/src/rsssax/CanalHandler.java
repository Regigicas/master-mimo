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
public class CanalHandler extends DefaultHandler
{
    private static final String ELEMENT_CHANNEL = "channel";
    private static final String ELEMENT_TITLE = "title";
    private static final String ELEMENT_LINK = "link";
    private static final String ELEMENT_DESCRIPTION = "description";
    private static final String ELEMENT_ITEM = "item";

    private List<Canal> canales = new ArrayList<>();
    private Canal currentCanal;
    private StringBuilder buffer = new StringBuilder();
    private RSSHandler rssHandler;

    public CanalHandler(RSSHandler rssHandler)
    { 
        this.rssHandler = rssHandler;
    }
  
    @Override
    public void startElement(String uri, String localName, String qName, Attributes att) throws SAXException
    {
        if (!qName.equals(localName))
            return;
        
        switch (localName)
        {
            case ELEMENT_CHANNEL:
                currentCanal = new Canal();
                currentCanal.setItem(new ArrayList<>());
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
           case ELEMENT_ITEM:
                rssHandler.restore();
                rssHandler.startElement(uri, localName, qName, att);
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
            case ELEMENT_CHANNEL:
                canales.add(currentCanal);
                rssHandler.endElement(uri, localName, qName);
                rssHandler.restore();
                break;
            case ELEMENT_TITLE:
                currentCanal.setTitle(buffer.toString());
                break;
            case ELEMENT_LINK:
                currentCanal.setLink(buffer.toString());
                break;
           case ELEMENT_DESCRIPTION:
                currentCanal.setDescription(buffer.toString());
                break;
            default:
                break;
        }
    }
    
    public Canal getCanalActual()
    {
        return currentCanal;
    }
    
    public List<Canal> getCanales()
    {
        return canales;
    }
}
