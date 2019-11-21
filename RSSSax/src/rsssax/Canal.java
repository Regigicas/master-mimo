/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package rsssax;

import java.util.List;

/**
 *
 * @author Regigicas
 */
public class Canal
{
    private String title;
    private String link;
    private String description;
    private List<Noticia> item;

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getLink()
    {
        return link;
    }

    public void setLink(String link)
    {
        this.link = link;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public List<Noticia> getItem()
    {
        return item;
    }

    public void setItem(List<Noticia> item)
    {
        this.item = item;
    }
    
    public void addItem(Noticia noticia)
    {
        this.item.add(noticia);
    }
}
