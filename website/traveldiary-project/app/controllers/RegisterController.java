package controllers;

import dao.InsertDAO;
import models.Location;
import models.User;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;

/**
 * Created by mk on 23.06.15.
 */
public class RegisterController extends Controller {

    @Transactional(readOnly = false)
    public static Result createUser() {
        User newUser = Json.fromJson(request().body().asJson(), User.class);
        InsertDAO.insertUser(newUser);
        return created(Json.toJson(newUser));
    }

    @Transactional(readOnly = false)
    public static Result createLocation() {
        Location newLocation = Json.fromJson(request().body().asJson(), Location.class);

        InsertDAO.insertLocation(newLocation);

        return created(Json.toJson(newLocation));
    }
}

