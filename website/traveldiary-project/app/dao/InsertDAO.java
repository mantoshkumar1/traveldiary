package dao;

import models.Location;
import models.User;
import play.db.jpa.JPA;

/**
 * Created by albert on 27.06.15.
 */
public class InsertDAO {

    public static void insertLocation(Location newLocation) {
        JPA.em().persist(newLocation);
    }

    public static void insertUser(User newUser) {
        JPA.em().persist(newUser);
    }

}