import { DB_HOST,DB_NAME,DB_PASSWORD,DB_USER } from ".";

export default{
    "development":{
        "username":DB_USER,
        "password":DB_PASSWORD,
        "database":DB_NAME,
        "host":DB_HOST,
        "dialect":"mysql"
    }
}