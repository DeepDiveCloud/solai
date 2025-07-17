-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: max_db
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (6,'Reitzel Briand SAS','16 Rue d’Athènes \n75009 Paris','France ','01 44 58 92 00 ','','2025-04-08 07:53:12');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `export_invoices`
--

DROP TABLE IF EXISTS `export_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `export_invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exporter_name` varchar(255) DEFAULT NULL,
  `gst_no` varchar(100) DEFAULT NULL,
  `iec_no` varchar(100) DEFAULT NULL,
  `exporter_address` text,
  `invoice_number` varchar(100) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `buyers_order` varchar(255) DEFAULT NULL,
  `origin_country` varchar(100) DEFAULT NULL,
  `destination_country` varchar(100) DEFAULT NULL,
  `consignee_name` varchar(255) DEFAULT NULL,
  `consignee_address` text,
  `notify1_name` varchar(255) DEFAULT NULL,
  `notify1_address` text,
  `notify2_name` varchar(255) DEFAULT NULL,
  `notify2_address` text,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_account` varchar(100) DEFAULT NULL,
  `bank_ifsc` varchar(50) DEFAULT NULL,
  `bank_swift` varchar(50) DEFAULT NULL,
  `bank_address` text,
  `pre_carriage_by` varchar(255) DEFAULT NULL,
  `place_of_receipt` varchar(255) DEFAULT NULL,
  `vessel_no` varchar(100) DEFAULT NULL,
  `port_of_loading` varchar(100) DEFAULT NULL,
  `port_of_discharge` varchar(100) DEFAULT NULL,
  `final_destination` varchar(100) DEFAULT NULL,
  `total_drums` int DEFAULT NULL,
  `total_qty` float DEFAULT NULL,
  `total_value` float DEFAULT NULL,
  `amount_in_words` text,
  `declaration` text,
  `net_drained_weight` varchar(100) DEFAULT NULL,
  `net_weight` varchar(100) DEFAULT NULL,
  `gross_weight` varchar(100) DEFAULT NULL,
  `lut_reference` varchar(255) DEFAULT NULL,
  `fssai_no` varchar(100) DEFAULT NULL,
  `remarks` text,
  `containers` json DEFAULT NULL,
  `products` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `export_invoices`
--

LOCK TABLES `export_invoices` WRITE;
/*!40000 ALTER TABLE `export_invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `export_invoices` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `greens_arrival`
--

LOCK TABLES `greens_arrival` WRITE;
/*!40000 ALTER TABLE `greens_arrival` DISABLE KEYS */;
INSERT INTO `greens_arrival` VALUES (83,'123','2025-04-15 00:00:00','2025-04-25 00:00:00','VINAYAKA AGRO TECH','','160+',1,2,1,1,5.00,'dfre',1,1,1,1,4.00,1.00,'2025-04-28 07:06:34',NULL,NULL,NULL,NULL,63.00,41.00,25.00,10.00,139.00,63.00,41.00,25.00,10.00,139.00),(84,'12','2025-07-09 00:00:00','2025-07-09 00:00:00','Vinayaga','','160+',21,21,21,21,84.00,'212',21,21,21,21,84.00,0.00,'2025-07-08 06:32:40',NULL,NULL,NULL,NULL,483.00,483.00,483.00,483.00,1932.00,483.00,483.00,483.00,483.00,1932.00),(85,'12324','2025-04-02 00:00:00','2025-07-09 00:00:00','produsmax','','160+',32,324,234,234,824.00,'324',324,324,324,324,1296.00,-472.00,'2025-07-08 11:03:05',NULL,NULL,NULL,NULL,20412.00,13284.00,8100.00,3240.00,45036.00,20412.00,13284.00,8100.00,3240.00,45036.00);
/*!40000 ALTER TABLE `greens_arrival` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `greens_status`
--

DROP TABLE IF EXISTS `greens_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `greens_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dc_weight` decimal(10,2) DEFAULT NULL,
  `factory_weight` decimal(10,2) DEFAULT NULL,
  `shortage` decimal(10,2) DEFAULT NULL,
  `160plus` decimal(10,2) DEFAULT NULL,
  `100plus` decimal(10,2) DEFAULT NULL,
  `30plus` decimal(10,2) DEFAULT NULL,
  `30minus` decimal(10,2) DEFAULT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `factory_arrival_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `greens_status`
--

LOCK TABLES `greens_status` WRITE;
/*!40000 ALTER TABLE `greens_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `greens_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_permissions`
--

DROP TABLE IF EXISTS `group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_permissions` (
  `group_id` int DEFAULT NULL,
  `permission_id` int DEFAULT NULL,
  KEY `group_id` (`group_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `group_permissions_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`id`),
  CONSTRAINT `group_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_permissions`
--

LOCK TABLES `group_permissions` WRITE;
/*!40000 ALTER TABLE `group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production`
--

LOCK TABLES `production` WRITE;
/*!40000 ALTER TABLE `production` DISABLE KEYS */;
INSERT INTO `production` VALUES (11,'2025-07-01',100.00,94.00,3.00,2.00,1.00,94.00,'','[{\"name\": \"A.Acid 500+\", \"value\": 20}, {\"name\": \"A.Acid CN\", \"value\": 20}]','[{\"name\": \"Vinegar 600+\", \"value\": 10}, {\"name\": \"Vinegar 150+\", \"value\": 20}]','[{\"name\": \"brine 300+\", \"value\": 10}, {\"name\": \"brine 160+\", \"value\": 14}]','2025-07-09 11:01:46'),(12,'2025-07-02',500.00,442.00,20.00,12.00,0.00,468.00,'','[{\"name\": \"A.Acid 160+\", \"value\": 230}]','[{\"name\": \"Vinegar 30+\", \"value\": 180}]','[{\"name\": \"brine 160+\", \"value\": 32}]','2025-07-09 11:08:54'),(13,'2025-07-10',500.00,2323.00,0.00,0.00,0.00,0.00,'','[{\"name\": \"A.Acid 500+\", \"value\": 2323}]','[]','[]','2025-07-10 06:49:18'),(14,'2025-07-10',3002.00,2343.00,2.00,2.00,2.00,6.00,'','[{\"name\": \"A.Acid 160+\", \"value\": 2343}]','[]','[]','2025-07-10 06:50:02'),(16,'2025-07-10',234324.00,23370.00,324.00,324.00,234.00,233442.00,'423','[{\"name\": \"A.Acid CN\", \"value\": 23}]','[{\"name\": \"Vinegar Mixed\", \"value\": 23}]','[{\"name\": \"brine 150/300\", \"value\": 23324}]','2025-07-10 09:14:56'),(17,'2025-07-10',4323.00,96.00,32.00,32.00,23.00,87.00,'','[{\"name\": \"A.ACID 60/160\", \"value\": 32}]','[{\"name\": \"Vinegar 80/150\", \"value\": 32}]','[{\"name\": \"brine 100/160\", \"value\": 32}]','2025-07-10 09:29:47');
/*!40000 ALTER TABLE `production` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_items`
--

DROP TABLE IF EXISTS `purchase_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchase_id` int NOT NULL,
  `product` varchar(100) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_id` (`purchase_id`),
  CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_items`
--

LOCK TABLES `purchase_items` WRITE;
/*!40000 ALTER TABLE `purchase_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_date` date NOT NULL,
  `invoice_no` varchar(50) NOT NULL,
  `supplier_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_prices`
--

DROP TABLE IF EXISTS `transport_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `season_name` varchar(255) NOT NULL,
  `Transport_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_prices`
--

LOCK TABLES `transport_prices` WRITE;
/*!40000 ALTER TABLE `transport_prices` DISABLE KEYS */;
INSERT INTO `transport_prices` VALUES (3,'2','2','2',2.00),(4,'1','5','we',2.00),(5,'1','d','fs',21.00),(6,'1','ranamas','chennaiu',123123.00),(7,'2','34','342',342.00);
/*!40000 ALTER TABLE `transport_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group_mapping`
--

DROP TABLE IF EXISTS `user_group_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_group_mapping` (
  `user_id` int DEFAULT NULL,
  `group_id` int DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `user_group_mapping_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_group_mapping_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group_mapping`
--

LOCK TABLES `user_group_mapping` WRITE;
/*!40000 ALTER TABLE `user_group_mapping` DISABLE KEYS */;
INSERT INTO `user_group_mapping` VALUES (5,4),(5,4);
/*!40000 ALTER TABLE `user_group_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group_membership`
--

DROP TABLE IF EXISTS `user_group_membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_group_membership` (
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`group_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `user_group_membership_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_group_membership_ibfk_2` FOREIGN KEY (`group_id`) REFERENCES `user_groups_def` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group_membership`
--

LOCK TABLES `user_group_membership` WRITE;
/*!40000 ALTER TABLE `user_group_membership` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_group_membership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `assigned_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups`
--

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
INSERT INTO `user_groups` VALUES (2,'test','/sales.html'),(4,'test2','/purchases.html'),(5,'test3','/admin.html');
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups_def`
--

DROP TABLE IF EXISTS `user_groups_def`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_groups_def` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups_def`
--

LOCK TABLES `user_groups_def` WRITE;
/*!40000 ALTER TABLE `user_groups_def` DISABLE KEYS */;
INSERT INTO `user_groups_def` VALUES (1,'Admin'),(2,'Editor'),(3,'Viewer');
/*!40000 ALTER TABLE `user_groups_def` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (5,'admin@example.com','$2b$10$WFNBLtAxG6AmnWuI7IE/AugCF90cBGXHv3FWipW3MnVSz4vAp1Z7y','admin','Ranjith'),(7,'ranjithraghavan90@gmail.com','$2b$10$mEUyWBSHewU7Pk4DQrtUa.MaNKHYlBEl8iMyC1XIxpsT0JMhgM8VC','user','dsfsd'),(8,'Jith220@gmail.com','$2b$10$fAiqNAPoWZu0kPLE1KuYE.2xtr0esEB/fiqr/VU5tDHyUTyYAvm42','user','Ranjith'),(13,'ram@gmail.com','$2b$10$JdoFrqJKMhWaeODe3TAKf.YgUaFfKOwq6xR77nM0BgTDB/mHvO7au','admin','ram');
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
  `season_name` varchar(255) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `vendor_name` varchar(255) NOT NULL,
  `pattern` varchar(255) NOT NULL,
  `price_160_plus` decimal(10,2) NOT NULL,
  `price_100_plus` decimal(10,2) NOT NULL,
  `price_30_plus` decimal(10,2) NOT NULL,
  `price_30_minus` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_prices`
--

LOCK TABLES `vendor_prices` WRITE;
/*!40000 ALTER TABLE `vendor_prices` DISABLE KEYS */;
INSERT INTO `vendor_prices` VALUES (11,'season-7','2024-12-15','2025-05-31','VINAYAKA AGRO TECH','160+',63.00,41.00,25.00,10.00,'2025-04-15 10:45:20'),(13,'season-7','2024-12-01','2025-05-31','produsmax','160+',63.00,41.00,25.00,10.00,'2025-04-15 10:56:52'),(14,'season-7','2024-12-01','2025-05-31','solai Agro','160+',45.00,25.00,13.00,3.00,'2025-04-15 10:58:48'),(15,'sean-7','2025-05-07','2025-08-31','Vinayaga','160+',23.00,23.00,23.00,23.00,'2025-07-07 08:51:04'),(16,'sean-7','2025-05-07','2025-08-31','Vinayaga','160+',23.00,23.00,23.00,23.00,'2025-07-07 08:51:05');
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

-- Dump completed on 2025-07-17 14:19:38
