package dao;

import models.*;
import play.db.jpa.JPA;

import javax.persistence.Query;
import javax.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by albert on 23.06.15.
 */
public class TravelDiaryDAO {

    public static List<Keyword> findAllKeywords() {
        TypedQuery<Keyword> query = JPA.em().createQuery("SELECT m FROM Keyword m", Keyword.class);

        return query.getResultList();
    }

    public static List<Keyword> findKeyWordsFor(String[] keywords) {

        if (keywords == null) {
            return new ArrayList<Keyword>();
        }

        String keywordQuery;

        // Add filter for all keywords. Keywords referenced by :keyword<id>
        if (keywords.length > 0) {

            keywordQuery = " k.keyword LIKE :keyword0";

            for (int i = 1; i < keywords.length; i++) {
                keywordQuery += " OR k.keyword LIKE :keyword" + i;
            }
        } else {
            keywordQuery = "";
        }


        String query = "SELECT * FROM Keyword k WHERE " + keywordQuery;

        Query searchQquery = JPA.em().createNativeQuery(query, Keyword.class);

        // Fill statement with corresponding keywords values
        for (int i = 0; i < keywords.length; i++) {
            if (keywords[i] != null) {
                searchQquery.setParameter("keyword" + i, keywords[i]);
            }
        }

        return (List<Keyword>) searchQquery.getResultList();
    }

    public static List<Vacation> findAllVacations() {
        TypedQuery<Vacation> query = JPA.em().createQuery("SELECT m FROM Vacation m", Vacation.class);

        return query.getResultList();
    }

    public static List<Vacation> findVacationsFor(String[] keywords) {

        if (keywords == null) {
            return new ArrayList<Vacation>();
        }

        String keywordQuery;

        // Add filter for all keywords. Keywords referenced by :keyword<id>
        if (keywords.length > 0) {

            //commented by Chetan
            keywordQuery = " AND (k.keyword LIKE :keyword0";
            //changed by Chetan to ckeck the new search
            //keywordQuery = " k.keyword LIKE :keyword0";

            for (int i = 1; i < keywords.length; i++) {
                keywordQuery += " OR k.keyword LIKE :keyword" + i;
            }

            //commented by Chetan
            keywordQuery += ")";
        } else {
            keywordQuery = "";
        }



       /* String query = "SELECT * from Vacation v inner JOIN" +
                " VacationKeywords vkw on v.id = vkw.vacationId" +
                " left OUTER join Keyword k on vkw.keywordId = k.id" +
                " LEFT OUTER join ActivityKeywords akw on k.id = akw.keywordId" +
                " where " + keywordQuery;

        System.out.println("*************************************");
        System.out.println(query);
        System.out.println("*************************************");
*/
        String query = "SELECT * FROM Vacation v WHERE " +
                "(SELECT COUNT(vkw.vacationId) FROM VacationKeywords vkw JOIN Keyword k on vkw.keywordId = k.id " +
                "WHERE v.id = vkw.vacationId" + keywordQuery + ") = " + keywords.length;


        Query searchQquery = JPA.em().createNativeQuery(query, Vacation.class);

        // Fill statement with corresponding keywords values
        for (int i = 0; i < keywords.length; i++) {
            if (keywords[i] != null) {
                searchQquery.setParameter("keyword" + i, keywords[i]);
            }
        }

        return (List<Vacation>) searchQquery.getResultList();
    }

    public static List<Activity> findAllActivities() {
        TypedQuery<Activity> query = JPA.em().createQuery("SELECT m FROM Activity m", Activity.class);

        return query.getResultList();
    }

    public static List<User> findAllUsers() {
        TypedQuery<User> query = JPA.em().createQuery("SELECT m FROM User m", User.class);

        return query.getResultList();
    }

    public static List<Role> findAllRoles() {
        TypedQuery<Role> query = JPA.em().createQuery("SELECT m FROM Role m", Role.class);

        return query.getResultList();
    }

    public static List<Review> findAllReviews() {
        TypedQuery<Review> query = JPA.em().createQuery("SELECT m FROM Review m", Review.class);

        return query.getResultList();
    }

    public static List<Location> findAllLocations() {
        TypedQuery<Location> query = JPA.em().createQuery("SELECT m FROM Location m", Location.class);
        return query.getResultList();
    }
}
