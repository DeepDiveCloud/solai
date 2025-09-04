-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: solai
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `greens_arrival`
--

DROP TABLE IF EXISTS `greens_arrival`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `greens_arrival` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dc_number` varchar(255) DEFAULT NULL,
  `dc_date` datetime DEFAULT NULL,
  `factory_arrival_date` datetime DEFAULT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `pattern` varchar(255) DEFAULT NULL,
  `d_160_plus` int DEFAULT NULL,
  `d_100_plus` int DEFAULT NULL,
  `d_30_plus` int DEFAULT NULL,
  `d_30_minus` int DEFAULT NULL,
  `total_dc_weight` decimal(10,2) DEFAULT NULL,
  `vehicle_no` varchar(255) DEFAULT NULL,
  `f_160_plus` int DEFAULT NULL,
  `f_100_plus` int DEFAULT NULL,
  `f_30_plus` int DEFAULT NULL,
  `f_30_minus` int DEFAULT NULL,
  `total_factory_weight` decimal(10,2) DEFAULT '0.00',
  `shortage_excess` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `green_price_160plus` decimal(10,2) DEFAULT NULL,
  `green_price_100plus` decimal(10,2) DEFAULT NULL,
  `green_price_30plus` decimal(10,2) DEFAULT NULL,
  `green_price_30minus` decimal(10,2) DEFAULT NULL,
  `F_price_160_plus` decimal(10,2) NOT NULL,
  `F_price_100_plus` decimal(10,2) NOT NULL,
  `F_price_30_plus` decimal(10,2) NOT NULL,
  `F_price_30_minus` decimal(10,2) NOT NULL,
  `F_total_greens_amount` decimal(10,2) NOT NULL,
  `dc_price_160_plus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dc_price_100_plus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dc_price_30_plus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dc_price_30_minus` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dc_total_greens_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_dc_vendor` (`dc_number`,`vendor`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `greens_arrival`
--

LOCK TABLES `greens_arrival` WRITE;
/*!40000 ALTER TABLE `greens_arrival` DISABLE KEYS */;
INSERT INTO `greens_arrival` VALUES (92,'311','2025-08-05 00:00:00','2025-08-06 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','sankarapuram','160+',3031,942,1226,588,5787.00,'TN 30 BC 4636',2864,994,1101,524,5483.00,304.00,'2025-08-06 09:22:06',NULL,NULL,NULL,NULL,143200.00,24850.00,14313.00,1572.00,183935.00,151550.00,23550.00,15938.00,1764.00,192802.00),(93,'314','2025-08-11 00:00:00','2025-08-12 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','sankarapuram','160+',3347,697,795,553,5392.00,'TN 30 BC 4636',3266,640,667,507,5080.00,312.00,'2025-08-12 10:59:38',NULL,NULL,NULL,NULL,163300.00,16000.00,8671.00,1521.00,189492.00,167350.00,17425.00,10335.00,1659.00,196769.00),(94,'315','2025-08-13 00:00:00','2025-08-14 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','sankarapuram','160+',3180,564,642,393,4779.00,'TN 30 BC 4636',3002,549,667,297,4515.00,264.00,'2025-08-14 07:58:03',NULL,NULL,NULL,NULL,150100.00,13725.00,8671.00,891.00,173387.00,159000.00,14100.00,8346.00,1179.00,182625.00),(95,'316','2025-08-15 00:00:00','2025-08-16 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','sankarapuram','160+',4345,924,972,483,6724.00,'TN 30 BC 4636',4183,840,975,434,6432.00,292.00,'2025-08-16 11:15:30',NULL,NULL,NULL,NULL,209150.00,21000.00,12675.00,1302.00,244127.00,217250.00,23100.00,12636.00,1449.00,254435.00),(96,'1968','2025-08-15 00:00:00','2025-08-16 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','Attur','160+',0,821,483,290,1594.00,'TN 77 T 6628',0,766,508,202,1476.00,118.00,'2025-08-16 11:16:43',NULL,NULL,NULL,NULL,0.00,19150.00,6604.00,606.00,26360.00,0.00,20525.00,6279.00,870.00,27674.00),(97,'317','2025-08-17 00:00:00','2025-08-18 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','sankarapuram','160+',4258,1056,1131,468,6913.00,'TN 30 BC 4636',3998,1071,1191,445,6705.00,208.00,'2025-08-18 10:20:06',NULL,NULL,NULL,NULL,199900.00,26775.00,15483.00,1335.00,243493.00,212900.00,26400.00,14703.00,1404.00,255407.00),(98,'1969','2025-08-17 00:00:00','2025-08-18 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','Attur','160+',0,977,668,246,1891.00,'TN 77 T 6628',0,913,623,197,1733.00,158.00,'2025-08-18 10:21:13',NULL,NULL,NULL,NULL,0.00,22825.00,8099.00,591.00,31515.00,0.00,24425.00,8684.00,738.00,33847.00),(99,'318','2025-08-19 00:00:00','2025-08-20 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','sankarapuram','160+',3719,910,1241,544,6414.00,'TN 30 BC 4636',3592,828,1169,510,6099.00,315.00,'2025-08-20 07:52:10',NULL,NULL,NULL,NULL,179600.00,20700.00,15197.00,1530.00,217027.00,185950.00,22750.00,16133.00,1632.00,226465.00),(100,'1971','2025-08-19 00:00:00','2025-08-20 00:00:00','SOLAI AGRO FRESH PRIVATE LIMITED','Attur','160+',0,1173,602,418,2193.00,'TN 29 CW 8407',0,1086,539,379,2004.00,189.00,'2025-08-20 07:53:23',NULL,NULL,NULL,NULL,0.00,27150.00,7007.00,1137.00,35294.00,0.00,29325.00,7826.00,1254.00,38405.00);
/*!40000 ALTER TABLE `greens_arrival` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `assigned_url` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'Admin','dashboard.html'),(2,'Purches',NULL),(3,'Production',NULL),(4,'Quality',NULL),(5,'Commercial',NULL),(6,'Packing',NULL),(7,'Sales',NULL),(8,'Logistics','logistics.html'),(9,'Greens Management','greens.html'),(10,'Dashboard','dashboard.html');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production`
--

DROP TABLE IF EXISTS `production`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production` (
  `id` int NOT NULL AUTO_INCREMENT,
  `production_date` date NOT NULL,
  `factory_weight` decimal(10,2) DEFAULT '0.00',
  `production_weight` decimal(10,2) DEFAULT NULL,
  `FF` decimal(10,2) DEFAULT '0.00',
  `soft` decimal(10,2) DEFAULT '0.00',
  `fungus_rotten` decimal(10,2) DEFAULT '0.00',
  `shortage_weight_loss` decimal(10,2) DEFAULT '0.00',
  `remark` text,
  `acetic_acid` json DEFAULT NULL,
  `vinegar` json DEFAULT NULL,
  `brine` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production`
--

LOCK TABLES `production` WRITE;
/*!40000 ALTER TABLE `production` DISABLE KEYS */;
INSERT INTO `production` VALUES (11,'2025-07-01',100.00,94.00,3.00,2.00,1.00,94.00,'','[{\"name\": \"A.Acid 500+\", \"value\": 20}, {\"name\": \"A.Acid CN\", \"value\": 20}]','[{\"name\": \"Vinegar 600+\", \"value\": 10}, {\"name\": \"Vinegar 150+\", \"value\": 20}]','[{\"name\": \"brine 300+\", \"value\": 10}, {\"name\": \"brine 160+\", \"value\": 14}]','2025-07-09 11:01:46'),(12,'2025-07-02',500.00,442.00,20.00,12.00,0.00,468.00,'','[{\"name\": \"A.Acid 160+\", \"value\": 230}]','[{\"name\": \"Vinegar 30+\", \"value\": 180}]','[{\"name\": \"brine 160+\", \"value\": 32}]','2025-07-09 11:08:54'),(13,'2025-07-10',500.00,2323.00,0.00,0.00,0.00,0.00,'','[{\"name\": \"A.Acid 500+\", \"value\": 2323}]','[]','[]','2025-07-10 06:49:18'),(14,'2025-07-10',3002.00,2343.00,2.00,2.00,2.00,6.00,'','[{\"name\": \"A.Acid 160+\", \"value\": 2343}]','[]','[]','2025-07-10 06:50:02'),(16,'2025-07-10',234324.00,23370.00,324.00,324.00,234.00,233442.00,'423','[{\"name\": \"A.Acid CN\", \"value\": 23}]','[{\"name\": \"Vinegar Mixed\", \"value\": 23}]','[{\"name\": \"brine 150/300\", \"value\": 23324}]','2025-07-10 09:14:56'),(18,'2025-07-23',24334.00,1629.00,75.00,75.00,76.00,226.00,'tddd','[{\"name\": \"A.Acid 300+\", \"value\": 432}]','[{\"name\": \"Vinegar 600+\", \"value\": 654}]','[{\"name\": \"brine 300+\", \"value\": 543}]','2025-07-23 10:53:20');
/*!40000 ALTER TABLE `production` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raw_material_purchases`
--

DROP TABLE IF EXISTS `raw_material_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raw_material_purchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_date` date NOT NULL,
  `invoice_no` varchar(50) NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `product` varchar(255) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raw_material_purchases`
--

LOCK TABLES `raw_material_purchases` WRITE;
/*!40000 ALTER TABLE `raw_material_purchases` DISABLE KEYS */;
INSERT INTO `raw_material_purchases` VALUES (1,'2025-07-03','234','dsf','260L Barrels',23.00,23.00,529.00,'2025-07-17 10:58:59'),(2,'2025-07-10','234','dsfsdf','Plywood',234.00,234.00,54756.00,'2025-07-17 10:59:39'),(3,'2025-07-10','234','dsfsdf','240L Barrels',32.00,32.00,1024.00,'2025-07-17 10:59:39'),(4,'2025-07-10','234','dsfsdf','Calcium Chloride',32.00,32.00,1024.00,'2025-07-17 10:59:39'),(5,'2025-07-15','23423','dgfsd','240L Barrels',342.00,232.00,79344.00,'2025-07-17 11:00:39'),(6,'2025-07-15','23423','dgfsd','Pallet',324.00,2343.00,759132.00,'2025-07-17 11:00:39'),(7,'2025-07-15','23423','dgfsd','KMS',324324.00,342.00,110918808.00,'2025-07-17 11:00:39');
/*!40000 ALTER TABLE `raw_material_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_group` (`user_id`,`group_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `user_groups_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_groups_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups`
--

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
INSERT INTO `user_groups` VALUES (10,11,9),(12,11,10);
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `super_admin` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ranjith','ranjith@solaiagro.com','$2b$10$Vu1bWA5iy0tewYwZ9SFhe.I7TM.9Ae0dNt64oGA/bzfwP/WsRwAu2','super_admin',1,'2025-09-02 06:49:52'),(11,'ram','ram@solaiagro.com','$2b$10$zjKcOKZYjUZjeL4N/RstWOI8.Us4OJV6Q2gLfwY0N5vWYjgn6g58u','user',0,'2025-09-02 10:40:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_prices`
--

DROP TABLE IF EXISTS `vendor_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendor_name` varchar(100) DEFAULT NULL,
  `season_name` varchar(100) DEFAULT NULL,
  `from_date` date DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `greens_location` varchar(100) DEFAULT NULL,
  `greens_pattern` varchar(100) DEFAULT NULL,
  `price_160_plus` decimal(10,2) DEFAULT NULL,
  `price_100_plus` decimal(10,2) DEFAULT NULL,
  `price_60_plus` decimal(10,2) DEFAULT NULL,
  `price_30_plus` decimal(10,2) DEFAULT NULL,
  `price_30_minus` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_prices`
--

LOCK TABLES `vendor_prices` WRITE;
/*!40000 ALTER TABLE `vendor_prices` DISABLE KEYS */;
INSERT INTO `vendor_prices` VALUES (10,'SOLAI AGRO FRESH PRIVATE LIMITED','SEASON - 8','2025-07-01','2025-10-30','sankarapuram','160+',50.00,25.00,0.00,13.00,3.00,'2025-08-06 09:16:54'),(11,'SOLAI AGRO FRESH PRIVATE LIMITED','SEASON - 8','2025-07-19','2025-10-31','Attur','160+',50.00,25.00,0.00,13.00,3.00,'2025-08-06 09:18:49');
/*!40000 ALTER TABLE `vendor_prices` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-04 12:35:59
