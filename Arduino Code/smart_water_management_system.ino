#include <ESP8266WiFi.h>
#include<FirebaseArduino.h>

#define FIREBASE_HOST "something.firebaseio.com"           // Enter database HOST without "https:// "  and "/" at the end of URL             
#define FIREBASE_AUTH "*********************************"   // Real-time database secret key here

#define WIFI_SSID "yourwifissid"            // WIFI SSID here                                   
#define WIFI_PASSWORD "yourpassword"        // WIFI password here

int motor = 0, count = 0, val = 0, man = 0, tmp;
float level = 0.0, distance;
const int trigPin = D8;
const int echoPin = D7;
const int motorPin = D6;

long duration;

int lvlmax = 3; // maximum desired water level i.e.(tank height in cm - 2 cm) {ex. 10 - 2 = 8 cm}
int lvlmin = 20; // minimum desired water level i.e.(tank height in cm - 8 cm) {ex. 10 - 8 = 2 cm}

void setup() {

  Serial.begin(9600);
  Serial.println("Communication Started \n\n");

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT);// Sets the echoPin as an Input
  pinMode(motorPin, OUTPUT);//  Sets the motorPin as an Output

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);                                     //try to connect with wifi
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP Address is : ");
  Serial.println(WiFi.localIP());    //print local IP address

  delay(30);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  delay(300);       // connect to firebase
}

void loop() {
  // Firebase Error Handling ************************************************
  if (Firebase.failed())
  {
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    Serial.println(Firebase.error());
    delay(10);
    Serial.println("Error connecting firebase!");
    count++;
    if (count == 10) {
      count = 0;
      ESP.reset();
    }
    return;
  }
  else {
    delay(300);
    delay(300);
    delay(300);
  }
  // ULTRASONIC *****************************************
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // Sets the trigPin on HIGH state for 10
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(100);
  digitalWrite(trigPin, LOW);

  Serial.println("Trigger for 10 \n\n");

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);

  Serial.println("duration calculated \n\n");

  Serial.println("assembling sonar\n\n");


  // Calculating the distance
  distance = duration * 0.034 / 2;

  // Prints the distance on the Serial Monitor
  Serial.print("Distance: ");
  Serial.println(distance);
  delay(100);
  if (distance >= lvlmin) {
    level = 0;
    motor = 1;
    Firebase.setFloat("/WatrManage/level", level);
    Serial.println("Water below desired level. Motor turned ON.\n");

    motor = 1;
    digitalWrite(D6, HIGH);
    Firebase.setFloat("/WatrManage/motorstatus", motor);
  }
  delay(500);

  if (distance > lvlmax && distance < lvlmin) {
    level = distance / 4;
    level = 5 - level;
    Firebase.setFloat("/WatrManage/level", level);
    Serial.print("Water level: ");
    Serial.println(level);
  }
  delay(5);

  if (distance <= lvlmax) {
    level = 5;
    Firebase.setFloat("/WatrManage/level", level);
    motor = 0;
    digitalWrite(D6, LOW);
    Firebase.setFloat("/WatrManage/motorstatus", motor);
    Serial.println("Water above desired level. Motor turned OFF.\n");
  }
  delay(5);

  val = Firebase.getInt("/WatrManage/man");

  man = val;

  // Manual option *******************************************

  if (man == 1) {
    while (1) {
      Serial.println("Welcome to Manual Mode. Motor turned ON.\n\n\n");
      delay(500);
      digitalWrite(D6, HIGH);
      motor = 1;
      Firebase.setFloat("/WatrManage/motorstatus", motor); // turned on motor
      if (man == 0) {
        digitalWrite(D6, LOW);
        motor = 0;
        Firebase.setFloat("/WatrManage/man", man);
        delay(100);
        Firebase.setFloat("/WatrManage/motorstatus", motor);
        delay(100);
        Serial.println("Exit Manual Mode. Motor turned OFF.\n\n\n");
        return;
      }
      // Calculateing distance in manual mode
      // Clears the trigPin
      digitalWrite(trigPin, LOW);
      delayMicroseconds(2);
      // Sets the trigPin on HIGH state for 10
      digitalWrite(trigPin, HIGH);
      delayMicroseconds(100);
      digitalWrite(trigPin, LOW);
      // Reads the echoPin, returns the sound wave travel time in microseconds
      duration = pulseIn(echoPin, HIGH);
      Serial.println("Manual mode. duration calculated \n\n");
      Serial.println("Manual mode. assembling sonar\n\n");
      // Calculating the distance
      distance = duration * 0.034 / 2;
      if (distance > lvlmax && distance < lvlmin) {
        level = distance / 4;
        level = 5 - level;
        Firebase.setFloat("/WatrManage/level", level);
        Serial.print("Water level: ");
        Serial.println(level);
      }
      delay(5);
      delay(5);
      if (distance <= lvlmax) {
        level = 5;
        Firebase.setFloat("/WatrManage/level", level);
        man = 0;
        Firebase.setFloat("/WatrManage/man", man);
        motor = 0;
        digitalWrite(D6, LOW);
        Firebase.setFloat("/WatrManage/motorstatus", motor);
        Serial.println("Manual Mode. Water above desired level. Motor turned OFF.\n\n\n");
      }
      tmp = Firebase.getInt("/WatrManage/man");
      man = tmp;
      delay(1500);
    }
  }
  delay(1500);
}
