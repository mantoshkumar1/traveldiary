package models;

/**
 * Created by Rike on 06.06.2015.
 */
public class Address extends Location {

    private String street;
    private String city;
    private String zipCode;
    private String country;

    public Address(String name, String description, String street, String city, String zipCode, String country) {
        super(name, description);
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
        this.country = country;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}