<?php
$host = "localhost";
$user = "root";
$password = "1234"; // Use your own XAMPP/MySQL password
$db = "contact_form";

// Create connection
$conn = new mysqli($host, $user, $password, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$response = '';  // Initialize response message

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get form data
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $phone = trim($_POST["phone"]);
    $message = trim($_POST["message"]);

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $phone, $message);

    if ($stmt->execute()) {
        // Success message
        $response = "Message sent successfully!";
    } else {
        // Error message
        $response = "Error: " . $stmt->error;
    }

    $stmt->close();
}

// Close the connection
$conn->close();

// Return the response message
echo $response;
?>
