
<?php
 $dsn = array(
    'type' => 'pgsql',
    'database' => "db_cis",
    'port' => 5432,
    'hostspec' => "localhost",
    'username' => "cis",
    'password' => "cis_passwd",
    "phptype" => "pgsql"
);

    try {
        $dsn = "pgsql:host=localhost;port=5432;dbname=db_cis;";
        // make a database connection
        $pdo = new PDO($dsn, "cis", "cis_passwd", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    
        if ($pdo) {
            echo "Connected to the $db database successfully!";
        }
    } catch (PDOException $e) {
        var_dump("ERRORR");
        die($e->getMessage());
    } finally {
        if ($pdo) {
            $pdo = null;
        }
    }
?>