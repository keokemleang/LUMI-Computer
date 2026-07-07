import { db } from "../src/lib/db";

// ----- Helpers -----
const j = (v: unknown) => JSON.stringify(v);

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

async function main() {
  console.log("Seeding KBSCircuit database...");

  // Clean
  await db.contactMessage.deleteMany();
  await db.newsletterSub.deleteMany();
  await db.order.deleteMany();
  await db.review.deleteMany();
  await db.download.deleteMany();
  await db.blogPost.deleteMany();
  await db.course.deleteMany();
  await db.project.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();
  await db.user.deleteMany();

  // Admin user
  await db.user.create({
    data: { email: "admin@kbscircuit.com", name: "KBSCircuit Admin", role: "admin" },
  });
  await db.user.create({
    data: { email: "student@example.com", name: "Sam Student", role: "customer" },
  });

  // ----- Categories -----
  const categories = [
    { slug: "arduino", name: "Arduino", description: "Arduino boards, shields and accessories for prototyping and learning.", icon: "Cpu", featured: true },
    { slug: "esp32", name: "ESP32", description: "Wi-Fi & Bluetooth-enabled microcontrollers for IoT and connected projects.", icon: "Wifi", featured: true },
    { slug: "stm32", name: "STM32", description: "Powerful ARM Cortex-M microcontrollers for advanced embedded systems.", icon: "CircuitBoard", featured: true },
    { slug: "raspberry-pi", name: "Raspberry Pi", description: "Single-board computers for computing, robotics and edge AI.", icon: "Server", featured: true },
    { slug: "sensors", name: "Sensors", description: "Temperature, motion, distance, gas and environmental sensors.", icon: "Radar", featured: true },
    { slug: "displays", name: "Displays", description: "OLED, TFT, LCD and e-ink displays for visual output.", icon: "Monitor", featured: true },
    { slug: "communication", name: "Communication Modules", description: "LoRa, Bluetooth, Wi-Fi, NRF and GPS modules.", icon: "Radio", featured: false },
    { slug: "motors", name: "Motors", description: "Servo, stepper and DC motors with drivers.", icon: "RotateCw", featured: false },
    { slug: "power", name: "Power Supplies", description: "Batteries, regulators, chargers and adapters.", icon: "BatteryCharging", featured: false },
    { slug: "breadboards", name: "Breadboards", description: "Solderless breadboards and jumper wires.", icon: "Grid3x3", featured: false },
    { slug: "pcb", name: "PCB", description: "Custom PCBs, protoboards and fabrication services.", icon: "Layers", featured: false },
    { slug: "tools", name: "Tools", description: "Soldering irons, multimeters, oscilloscopes and hand tools.", icon: "Wrench", featured: false },
    { slug: "accessories", name: "Accessories", description: "Cables, connectors, enclosures and misc hardware.", icon: "Cable", featured: false },
    { slug: "starter-kits", name: "Starter Kits", description: "All-in-one kits to begin your electronics journey.", icon: "Package", featured: true },
    { slug: "project-kits", name: "Project Kits", description: "Complete kits with all parts for a specific project.", icon: "Boxes", featured: true },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const created = await db.category.create({
      data: { ...c, image: img("cat-" + c.slug, 600, 400) },
    });
    catMap[c.slug] = created.id;
  }

  // ----- Products -----
  const products = [
    {
      slug: "arduino-uno-r3",
      name: "Arduino Uno R3",
      shortDesc: "The classic open-source microcontroller board for makers and students.",
      description:
        "Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins (of which 6 can be used as PWM outputs), 6 analog inputs, a 16 MHz quartz crystal, a USB connection, a power jack, an ICSP header and a reset button. The perfect starting point for learning embedded electronics.",
      price: 24.99, compareAt: 29.99, sku: "ARD-UNO-R3", stock: 120,
      images: j([img("arduino-uno-1"), img("arduino-uno-2"), img("arduino-uno-3")]),
      category: "arduino", compatibility: "Arduino IDE, AVR",
      specs: j([
        { label: "Microcontroller", value: "ATmega328P" },
        { label: "Operating Voltage", value: "5V" },
        { label: "Digital I/O Pins", value: "14 (6 PWM)" },
        { label: "Analog Input Pins", value: "6" },
        { label: "Flash Memory", value: "32 KB" },
        { label: "Clock Speed", value: "16 MHz" },
      ]),
      featured: true, rating: 4.8, reviewCount: 214,
    },
    {
      slug: "arduino-nano",
      name: "Arduino Nano",
      shortDesc: "Compact, breadboard-friendly board for space-constrained projects.",
      description:
        "Arduino Nano is a small, complete, and breadboard-friendly board based on the ATmega328P. It has more or less the same functionality of the Arduino Uno but in a smaller form factor, ideal for compact projects and wearables.",
      price: 18.5, sku: "ARD-NANO", stock: 85,
      images: j([img("arduino-nano-1"), img("arduino-nano-2")]),
      category: "arduino", compatibility: "Arduino IDE, AVR",
      specs: j([
        { label: "Microcontroller", value: "ATmega328P" },
        { label: "Operating Voltage", value: "5V" },
        { label: "Digital I/O Pins", value: "14 (6 PWM)" },
        { label: "Analog Inputs", value: "8" },
        { label: "Flash Memory", value: "32 KB" },
      ]),
      featured: false, rating: 4.7, reviewCount: 132,
    },
    {
      slug: "esp32-devkit-v1",
      name: "ESP32 DevKit V1",
      shortDesc: "Dual-core Wi-Fi + Bluetooth microcontroller for IoT applications.",
      description:
        "The ESP32 DevKit V1 is a powerful Wi-Fi and Bluetooth-enabled microcontroller with a dual-core processor running at 240MHz. Perfect for IoT projects, home automation, and wireless sensor networks. Supports Arduino IDE, ESP-IDF, and MicroPython.",
      price: 12.99, compareAt: 15.99, sku: "ESP32-DEV-V1", stock: 200,
      images: j([img("esp32-1"), img("esp32-2"), img("esp32-3")]),
      category: "esp32", compatibility: "Arduino IDE, ESP-IDF, MicroPython",
      specs: j([
        { label: "CPU", value: "Xtensa dual-core 32-bit LX6" },
        { label: "Clock Speed", value: "240 MHz" },
        { label: "Wi-Fi", value: "802.11 b/g/n" },
        { label: "Bluetooth", value: "v4.2 BR/EDR + BLE" },
        { label: "Flash", value: "4 MB" },
        { label: "GPIO", value: "34" },
      ]),
      featured: true, rating: 4.9, reviewCount: 387,
    },
    {
      slug: "esp32-cam",
      name: "ESP32-CAM Module",
      shortDesc: "ESP32 with OV2640 camera for vision and streaming projects.",
      description:
        "ESP32-CAM is a low-cost development board with an integrated camera module (OV2640). Supports Wi-Fi image transmission, video streaming, and face recognition. Ideal for AIoT camera projects, security, and remote monitoring.",
      price: 9.99, sku: "ESP32-CAM", stock: 150,
      images: j([img("esp32cam-1"), img("esp32cam-2")]),
      category: "esp32", compatibility: "Arduino IDE, ESP-IDF",
      specs: j([
        { label: "CPU", value: "ESP32 dual-core" },
        { label: "Camera", value: "OV2640 2MP" },
        { label: "Wi-Fi", value: "802.11 b/g/n" },
        { label: "Flash", value: "4 MB (microSD slot)" },
      ]),
      featured: false, rating: 4.5, reviewCount: 98,
    },
    {
      slug: "stm32f103c8t6",
      name: "STM32F103C8T6 Blue Pill",
      shortDesc: "ARM Cortex-M3 board for professional embedded development.",
      description:
        "The STM32 Blue Pill is a minimal development board based on the STM32F103C8T6 ARM Cortex-M3 processor running at 72MHz. Excellent for learning professional ARM development using STM32CubeIDE, Keil, or PlatformIO.",
      price: 6.5, sku: "STM32-BP", stock: 90,
      images: j([img("stm32-1"), img("stm32-2")]),
      category: "stm32", compatibility: "STM32CubeIDE, Keil, PlatformIO",
      specs: j([
        { label: "Core", value: "ARM Cortex-M3" },
        { label: "Clock", value: "72 MHz" },
        { label: "Flash", value: "64 KB" },
        { label: "RAM", value: "20 KB" },
      ]),
      featured: false, rating: 4.4, reviewCount: 76,
    },
    {
      slug: "raspberry-pi-4-4gb",
      name: "Raspberry Pi 4 Model B (4GB)",
      shortDesc: "Quad-core single-board computer for computing and edge AI.",
      description:
        "Raspberry Pi 4 Model B with 4GB RAM features a quad-core 64-bit ARM Cortex-A72 processor, dual 4K display support, Gigabit Ethernet, USB 3.0, and dual-band Wi-Fi. Ideal for desktop computing, robotics, and edge AI workloads.",
      price: 65.0, compareAt: 75.0, sku: "RPi4-4GB", stock: 40,
      images: j([img("rpi4-1"), img("rpi4-2"), img("rpi4-3")]),
      category: "raspberry-pi", compatibility: "Raspberry Pi OS, Ubuntu",
      specs: j([
        { label: "CPU", value: "BCM2711 quad-core A72" },
        { label: "RAM", value: "4 GB LPDDR4" },
        { label: "Wi-Fi", value: "802.11ac dual-band" },
        { label: "Bluetooth", value: "5.0" },
        { label: "Video", value: "Dual micro-HDMI 4K" },
      ]),
      featured: true, rating: 4.9, reviewCount: 421,
    },
    {
      slug: "dht22-sensor",
      name: "DHT22 Temperature & Humidity Sensor",
      shortDesc: "High-accuracy digital sensor for temperature and humidity.",
      description:
        "DHT22 is a basic, low-cost digital temperature and humidity sensor with high accuracy and stability. Uses a capacitive humidity sensor and a thermistor to measure the surrounding air. Perfect for weather stations and environment monitoring.",
      price: 4.99, sku: "SEN-DHT22", stock: 300,
      images: j([img("dht22-1"), img("dht22-2")]),
      category: "sensors", compatibility: "Arduino, ESP32, STM32",
      specs: j([
        { label: "Temperature Range", value: "-40 to 80°C" },
        { label: "Humidity Range", value: "0-100% RH" },
        { label: "Accuracy", value: "±0.5°C, ±2% RH" },
        { label: "Interface", value: "Single-wire digital" },
      ]),
      featured: false, rating: 4.6, reviewCount: 156,
    },
    {
      slug: "hc-sr04-ultrasonic",
      name: "HC-SR04 Ultrasonic Distance Sensor",
      shortDesc: "Non-contact distance measurement from 2cm to 400cm.",
      description:
        "HC-SR04 ultrasonic sensor provides 2cm - 400cm non-contact measurement function with ranging accuracy up to 3mm. Widely used in obstacle avoidance, robotics, and liquid level detection projects.",
      price: 2.99, sku: "SEN-HCSR04", stock: 500,
      images: j([img("hcsr04-1")]),
      category: "sensors", compatibility: "Arduino, ESP32",
      specs: j([
        { label: "Range", value: "2cm - 400cm" },
        { label: "Accuracy", value: "3mm" },
        { label: "Operating Voltage", value: "5V" },
        { label: "Measuring Angle", value: "15°" },
      ]),
      featured: false, rating: 4.7, reviewCount: 203,
    },
    {
      slug: "ssd1306-oled-096",
      name: "0.96\" OLED Display (SSD1306, I2C)",
      shortDesc: "128x64 monochrome OLED for crisp text and graphics.",
      description:
        "A 0.96 inch OLED display module with SSD1306 driver, 128x64 resolution, I2C interface. Low power consumption with self-emissive technology — no backlight needed. Great for displaying sensor data and small UIs.",
      price: 5.49, sku: "DISP-OLED-096", stock: 180,
      images: j([img("oled-1")]),
      category: "displays", compatibility: "Arduino, ESP32, STM32",
      specs: j([
        { label: "Resolution", value: "128 x 64" },
        { label: "Driver", value: "SSD1306" },
        { label: "Interface", value: "I2C" },
        { label: "Operating Voltage", value: "3.3-5V" },
      ]),
      featured: false, rating: 4.8, reviewCount: 178,
    },
    {
      slug: "sg90-servo",
      name: "SG90 Micro Servo Motor",
      shortDesc: "Small, lightweight servo for robotics and RC projects.",
      description:
        "TowerPro SG90 is a micro servo motor with 180° rotation. Compact, lightweight and low-cost — ideal for robotics, RC vehicles, and small actuator projects. Operates on 4.8-6V.",
      price: 3.99, sku: "MOT-SG90", stock: 320,
      images: j([img("sg90-1")]),
      category: "motors", compatibility: "Arduino, ESP32",
      specs: j([
        { label: "Torque", value: "1.8 kg·cm" },
        { label: "Speed", value: "0.1s/60°" },
        { label: "Rotation", value: "0-180°" },
        { label: "Operating Voltage", value: "4.8-6V" },
      ]),
      featured: false, rating: 4.5, reviewCount: 145,
    },
    {
      slug: "l298n-motor-driver",
      name: "L298N Dual H-Bridge Motor Driver",
      shortDesc: "Drive two DC motors or one stepper motor up to 2A.",
      description:
        "L298N is a dual H-Bridge motor driver which allows speed and direction control of two DC motors or one stepper motor. Handles up to 35V and 2A per channel. Essential for robotics and motor control projects.",
      price: 6.99, sku: "MOT-L298N", stock: 140,
      images: j([img("l298n-1")]),
      category: "motors", compatibility: "Arduino, ESP32, STM32",
      specs: j([
        { label: "Max Voltage", value: "35V" },
        { label: "Max Current", value: "2A per channel" },
        { label: "Channels", value: "2 (dual H-bridge)" },
      ]),
      featured: false, rating: 4.6, reviewCount: 112,
    },
    {
      slug: "nrf24l01-module",
      name: "nRF24L01 Wireless Transceiver",
      shortDesc: "2.4GHz wireless module for long-range communication.",
      description:
        "nRF24L01 is a 2.4GHz wireless transceiver module with SPI interface. Supports up to 6 receivers, low power consumption and ranges up to 100m (with antenna). Ideal for wireless sensor networks and remote control.",
      price: 3.49, sku: "COM-NRF24", stock: 220,
      images: j([img("nrf24-1")]),
      category: "communication", compatibility: "Arduino, ESP32, STM32",
      specs: j([
        { label: "Frequency", value: "2.4 GHz" },
        { label: "Range", value: "up to 100m" },
        { label: "Interface", value: "SPI" },
        { label: "Data Rate", value: "250kbps - 2Mbps" },
      ]),
      featured: false, rating: 4.4, reviewCount: 87,
    },
    {
      slug: "mb-102-breadboard",
      name: "MB-102 Solderless Breadboard 830pts",
      shortDesc: "Standard 830-point breadboard with power rails.",
      description:
        "MB-102 breadboard with 830 tie-points and two power rails on each side. Compatible with standard 0.1\" pitch components and jumper wires. Self-adhesive backing for mounting.",
      price: 3.5, sku: "BB-MB102", stock: 400,
      images: j([img("breadboard-1")]),
      category: "breadboards", compatibility: "Universal",
      specs: j([
        { label: "Tie Points", value: "830" },
        { label: "Power Rails", value: "4 (2 per side)" },
      ]),
      featured: false, rating: 4.7, reviewCount: 234,
    },
    {
      slug: "arduino-starter-kit",
      name: "Arduino Starter Kit (200pc)",
      shortDesc: "Everything you need to start with Arduino — board + 200 components.",
      description:
        "Comprehensive Arduino starter kit including an Arduino Uno R3, breadboard, jumper wires, LEDs, resistors, sensors (DHT11, ultrasonic, PIR), servo, LCD, and a project guide booklet. Perfect for students and beginners.",
      price: 49.99, compareAt: 64.99, sku: "KIT-START-200", stock: 60,
      images: j([img("starter-kit-1"), img("starter-kit-2")]),
      category: "starter-kits", compatibility: "Arduino IDE",
      specs: j([
        { label: "Pieces", value: "200+" },
        { label: "Includes Board", value: "Arduino Uno R3" },
        { label: "Guide", value: "Project booklet" },
      ]),
      featured: true, rating: 4.9, reviewCount: 312,
    },
    {
      slug: "smart-home-kit",
      name: "Smart Home IoT Project Kit",
      shortDesc: "Complete ESP32-based smart home kit with sensors and relays.",
      description:
        "Build a full smart home system with this ESP32-based kit. Includes ESP32 board, DHT22, relays, PIR motion, gas sensor, OLED display, and all wiring. Comes with source code, wiring diagrams, and a step-by-step video course.",
      price: 79.99, compareAt: 99.99, sku: "KIT-SMARTHOME", stock: 35,
      images: j([img("smarthome-kit-1"), img("smarthome-kit-2"), img("smarthome-kit-3")]),
      category: "project-kits", compatibility: "ESP32, Arduino IDE",
      specs: j([
        { label: "Board", value: "ESP32 DevKit" },
        { label: "Sensors", value: "DHT22, PIR, MQ-2, Relay" },
        { label: "Includes", value: "Source code + video course" },
      ]),
      featured: true, rating: 4.8, reviewCount: 142,
    },
    {
      slug: "robot-arm-kit",
      name: "4-DOF Robotic Arm Kit",
      shortDesc: "Servo-driven robotic arm for learning robotics and kinematics.",
      description:
        "A 4-degree-of-freedom robotic arm kit driven by SG90/MG996R servos. Includes acrylic frame, servos, joystick controller, and Arduino-compatible code. Great for learning robotics, kinematics, and control systems.",
      price: 54.99, sku: "KIT-ROBOTARM", stock: 28,
      images: j([img("robotarm-1"), img("robotarm-2")]),
      category: "project-kits", compatibility: "Arduino, ESP32",
      specs: j([
        { label: "Degrees of Freedom", value: "4" },
        { label: "Servos", value: "4x SG90/MG996R" },
        { label: "Control", value: "Joystick module" },
      ]),
      featured: false, rating: 4.6, reviewCount: 67,
    },
  ];

  for (const p of products) {
    const { category, ...rest } = p;
    await db.product.create({
      data: {
        ...rest,
        datasheetUrl: `https://example.com/datasheets/${p.sku}.pdf`,
        categoryId: catMap[category],
        relatedCourse: category === "esp32" || category === "arduino" ? "esp32-iot-bootcamp" : "arduino-fundamentals",
        relatedProject: category === "esp32" ? "smart-home-automation" : category === "arduino" ? "weather-station" : "raspberry-pi-media-center",
      },
    });
  }

  // ----- Projects -----
  const projects = [
    {
      slug: "smart-home-automation",
      title: "Smart Home Automation with ESP32",
      overview: "Build a complete smart home system controlling lights, fans, and monitoring temperature, motion and gas leaks over Wi-Fi.",
      description:
        "This project walks you through building a full smart home automation system using an ESP32. You'll connect relays to control appliances, sensors to monitor the environment, and a web dashboard to control everything from your phone. Includes source code, wiring diagrams, PCB files, and a video tutorial.",
      difficulty: "Intermediate", estimatedTime: "2-3 days",
      images: j([img("proj-smarthome-1"), img("proj-smarthome-2"), img("proj-smarthome-3")]),
      videoUrl: "https://www.youtube.com/embed/placeholder1",
      requiredComponents: j(["ESP32 DevKit V1", "4-Channel Relay Module", "DHT22 Sensor", "PIR Motion Sensor", "MQ-2 Gas Sensor", "OLED Display"]),
      circuitDiagram: img("circuit-smarthome", 1000, 700),
      sourceCodeUrl: "https://github.com/kbscircuit/smart-home",
      pcbFilesUrl: "https://github.com/kbscircuit/smart-home/tree/main/pcb",
      docsUrl: "https://docs.kbscircuit.com/smart-home",
      slidesUrl: "https://docs.kbscircuit.com/smart-home/slides.pdf",
      kitProductId: "smart-home-kit",
      category: "IoT", featured: true, rating: 4.8, reviewCount: 95,
      tags: j(["ESP32", "IoT", "Smart Home", "Relay"]),
    },
    {
      slug: "weather-station",
      title: "Arduino Weather Station",
      overview: "Build a real-time weather station measuring temperature, humidity, pressure, and displaying data on an OLED screen.",
      description:
        "Create a desktop weather station using Arduino Uno, a BME280 sensor, and an OLED display. The project logs data and shows trends. Great for learning sensor integration and display programming.",
      difficulty: "Beginner", estimatedTime: "1 day",
      images: j([img("proj-weather-1"), img("proj-weather-2")]),
      videoUrl: "https://www.youtube.com/embed/placeholder2",
      requiredComponents: j(["Arduino Uno R3", "BME280 Sensor", "0.96\" OLED Display", "Breadboard", "Jumper Wires"]),
      circuitDiagram: img("circuit-weather", 1000, 700),
      sourceCodeUrl: "https://github.com/kbscircuit/weather-station",
      pcbFilesUrl: "https://github.com/kbscircuit/weather-station/tree/main/pcb",
      docsUrl: "https://docs.kbscircuit.com/weather-station",
      kitProductId: "arduino-starter-kit",
      category: "Sensors", featured: true, rating: 4.7, reviewCount: 78,
      tags: j(["Arduino", "Sensors", "OLED"]),
    },
    {
      slug: "raspberry-pi-media-center",
      title: "Raspberry Pi Media Center",
      overview: "Transform a Raspberry Pi 4 into a full home media center with streaming and remote control.",
      description:
        "Turn your Raspberry Pi 4 into a powerful media center using Kodi. Stream movies, music, and photos, control via phone, and add network storage. Perfect for learning Linux and media servers.",
      difficulty: "Beginner", estimatedTime: "2 hours",
      images: j([img("proj-media-1"), img("proj-media-2")]),
      videoUrl: "https://www.youtube.com/embed/placeholder3",
      requiredComponents: j(["Raspberry Pi 4 (4GB)", "MicroSD 32GB", "HDMI Cable", "Power Supply 5V/3A"]),
      circuitDiagram: img("circuit-media", 1000, 700),
      sourceCodeUrl: "https://github.com/kbscircuit/media-center",
      docsUrl: "https://docs.kbscircuit.com/media-center",
      kitProductId: "raspberry-pi-4-4gb",
      category: "Raspberry Pi", featured: false, rating: 4.6, reviewCount: 54,
      tags: j(["Raspberry Pi", "Media", "Linux"]),
    },
    {
      slug: "line-following-robot",
      title: "Line Following Robot with Arduino",
      overview: "Build an autonomous robot that follows a line using IR sensors and motor control.",
      description:
        "Learn robotics fundamentals by building a line-following robot. Uses Arduino, IR sensor array, L298N motor driver, and DC motors. Teaches PID control and sensor fusion basics.",
      difficulty: "Intermediate", estimatedTime: "2 days",
      images: j([img("proj-linebot-1"), img("proj-linebot-2")]),
      videoUrl: "https://www.youtube.com/embed/placeholder4",
      requiredComponents: j(["Arduino Uno R3", "IR Sensor Array (5ch)", "L298N Motor Driver", "2x DC Motors", "Chassis Kit", "Battery Pack"]),
      circuitDiagram: img("circuit-linebot", 1000, 700),
      sourceCodeUrl: "https://github.com/kbscircuit/line-follower",
      pcbFilesUrl: "https://github.com/kbscircuit/line-follower/tree/main/pcb",
      docsUrl: "https://docs.kbscircuit.com/line-follower",
      kitProductId: "robot-arm-kit",
      category: "Robotics", featured: true, rating: 4.7, reviewCount: 89,
      tags: j(["Arduino", "Robotics", "Motors", "PID"]),
    },
    {
      slug: "esp32-cam-security",
      title: "ESP32-CAM Wireless Security Camera",
      overview: "Build a low-cost Wi-Fi security camera with live streaming and motion detection.",
      description:
        "Create a wireless security camera using ESP32-CAM. Stream live video to a browser, add motion detection, and save photos to an SD card or cloud. Great introduction to edge vision.",
      difficulty: "Intermediate", estimatedTime: "1-2 days",
      images: j([img("proj-cam-1"), img("proj-cam-2")]),
      videoUrl: "https://www.youtube.com/embed/placeholder5",
      requiredComponents: j(["ESP32-CAM Module", "FTDI Programmer", "Jumper Wires", "MicroSD Card"]),
      circuitDiagram: img("circuit-cam", 1000, 700),
      sourceCodeUrl: "https://github.com/kbscircuit/esp32-cam-security",
      docsUrl: "https://docs.kbscircuit.com/esp32-cam",
      kitProductId: "esp32-cam",
      category: "IoT", featured: false, rating: 4.5, reviewCount: 61,
      tags: j(["ESP32", "Camera", "Security", "IoT"]),
    },
    {
      slug: "stm32-data-logger",
      title: "STM32 Multi-Channel Data Logger",
      overview: "Professional data logging system using STM32 with SD card storage and USB serial.",
      description:
        "Build a multi-channel data logger with STM32 Blue Pill. Reads analog sensors at high speed, logs to SD card with timestamps, and streams over USB. Teaches DMA, RTOS basics, and FATFS.",
      difficulty: "Advanced", estimatedTime: "3-4 days",
      images: j([img("proj-logger-1"), img("proj-logger-2")]),
      videoUrl: "https://www.youtube.com/embed/placeholder6",
      requiredComponents: j(["STM32F103 Blue Pill", "MicroSD Module", "DS3231 RTC", "Sensors", "USB-TTL"]),
      circuitDiagram: img("circuit-logger", 1000, 700),
      sourceCodeUrl: "https://github.com/kbscircuit/stm32-datalogger",
      pcbFilesUrl: "https://github.com/kbscircuit/stm32-datalogger/tree/main/pcb",
      docsUrl: "https://docs.kbscircuit.com/stm32-datalogger",
      category: "STM32", featured: false, rating: 4.6, reviewCount: 42,
      tags: j(["STM32", "Data Logging", "SD Card"]),
    },
  ];

  for (const proj of projects) {
    const { kitProductId, ...rest } = proj;
    await db.project.create({
      data: {
        ...rest,
        kitProductId: kitProductId || null,
      },
    });
  }

  // ----- Courses -----
  const courses = [
    {
      slug: "arduino-fundamentals",
      title: "Arduino Fundamentals: From Zero to Builder",
      description:
        "A complete beginner-friendly course covering Arduino programming, electronics basics, and 10 hands-on projects. No prior experience required.",
      overview: "Learn Arduino from the ground up. Start with blinking an LED and progress to building a weather station, a line-following robot, and a smart plant monitor. Includes code, wiring diagrams, and quizzes.",
      thumbnail: img("course-arduino", 800, 500),
      instructor: "Eng. David Chen", instructorBio: "Embedded systems engineer with 12+ years teaching Arduino and robotics.",
      difficulty: "Beginner", duration: "8 hours", lessonsCount: 42,
      lessons: j([
        { title: "Introduction to Arduino", duration: "12 min" },
        { title: "Digital I/O & Blinking LEDs", duration: "18 min" },
        { title: "Reading Buttons & Sensors", duration: "22 min" },
        { title: "PWM & Fading LEDs", duration: "15 min" },
        { title: "Serial Communication", duration: "20 min" },
        { title: "Driving Motors", duration: "25 min" },
        { title: "Displays (LCD & OLED)", duration: "28 min" },
        { title: "Project: Weather Station", duration: "45 min" },
      ]),
      requirements: j(["No prior coding experience", "Arduino Starter Kit (recommended)"]),
      projectsIncluded: j(["Weather Station", "Smart Plant Monitor", "LED Dice"]),
      componentsRequired: j(["Arduino Uno", "Breadboard", "LEDs, resistors, sensors"]),
      price: 0, videoUrl: "https://www.youtube.com/embed/placeholderc1",
      featured: true, rating: 4.9, reviewCount: 521,
    },
    {
      slug: "esp32-iot-bootcamp",
      title: "ESP32 IoT Bootcamp: Build Connected Devices",
      description:
        "Master the ESP32 and build real IoT projects: smart home, cloud dashboards, OTA updates, and MQTT integration.",
      overview: "Go deep with ESP32. Learn Wi-Fi, Bluetooth, MQTT, OTA, and cloud integration. Build a smart home system and a remote sensor dashboard with real-time data.",
      thumbnail: img("course-esp32", 800, 500),
      instructor: "Dr. Aisha Rahman", instructorBio: "IoT researcher, PhD in Embedded Systems, author of 'Building IoT Devices'.",
      difficulty: "Intermediate", duration: "12 hours", lessonsCount: 56,
      lessons: j([
        { title: "ESP32 Architecture & Setup", duration: "20 min" },
        { title: "Wi-Fi Connectivity", duration: "25 min" },
        { title: "HTTP & REST APIs", duration: "30 min" },
        { title: "MQTT Messaging", duration: "28 min" },
        { title: "Bluetooth Low Energy", duration: "32 min" },
        { title: "OTA Firmware Updates", duration: "22 min" },
        { title: "Cloud Dashboard Integration", duration: "35 min" },
        { title: "Project: Smart Home", duration: "60 min" },
      ]),
      requirements: j(["Basic Arduino knowledge", "ESP32 DevKit", "Wi-Fi network"]),
      projectsIncluded: j(["Smart Home Automation", "Remote Sensor Dashboard", "BLE Beacon"]),
      componentsRequired: j(["ESP32 DevKit", "DHT22", "Relay Module", "OLED Display"]),
      price: 49.99, videoUrl: "https://www.youtube.com/embed/placeholderc2",
      featured: true, rating: 4.8, reviewCount: 347,
    },
    {
      slug: "pcb-design-kicad",
      title: "PCB Design with KiCad: From Schematic to Fabrication",
      description:
        "Design professional PCBs from scratch using KiCad. Learn schematic capture, layout, routing, and manufacturing files.",
      overview: "Master PCB design with the free, open-source KiCad EDA. From schematic capture through layout, routing, DRC, and generating Gerber files for fabrication.",
      thumbnail: img("course-pcb", 800, 500),
      instructor: "Michael Torres", instructorBio: "Senior hardware engineer, designed 200+ commercial PCBs.",
      difficulty: "Intermediate", duration: "10 hours", lessonsCount: 38,
      lessons: j([
        { title: "Introduction to PCB Design", duration: "15 min" },
        { title: "KiCad Setup & Tour", duration: "18 min" },
        { title: "Schematic Capture", duration: "30 min" },
        { title: "Footprints & Libraries", duration: "25 min" },
        { title: "Board Layout Basics", duration: "35 min" },
        { title: "Routing Techniques", duration: "40 min" },
        { title: "Design Rules & DRC", duration: "20 min" },
        { title: "Generating Gerbers", duration: "18 min" },
      ]),
      requirements: j(["Basic electronics knowledge", "KiCad installed (free)"]),
      projectsIncluded: j(["LED Blinker Board", "Sensor Breakout Board"]),
      componentsRequired: j(["PCB design software only"]),
      price: 39.99, videoUrl: "https://www.youtube.com/embed/placeholderc3",
      featured: false, rating: 4.7, reviewCount: 198,
    },
    {
      slug: "embedded-c-stm32",
      title: "Embedded C Programming on STM32",
      description:
        "Professional firmware development with STM32 HAL, CubeMX, interrupts, DMA, and RTOS basics.",
      overview: "Level up your embedded career with STM32. Learn the HAL, peripherals, interrupts, DMA, timers, and FreeRTOS basics with hands-on labs.",
      thumbnail: img("course-stm32", 800, 500),
      instructor: "Prof. Liam O'Brien", instructorBio: "University lecturer in embedded systems, ARM certified.",
      difficulty: "Advanced", duration: "15 hours", lessonsCount: 64,
      lessons: j([
        { title: "ARM Cortex-M Overview", duration: "22 min" },
        { title: "STM32CubeMX Setup", duration: "25 min" },
        { title: "GPIO Programming", duration: "28 min" },
        { title: "Interrupts & NVIC", duration: "32 min" },
        { title: "Timers & PWM", duration: "30 min" },
        { title: "ADC & DAC", duration: "28 min" },
        { title: "DMA Deep Dive", duration: "35 min" },
        { title: "FreeRTOS Basics", duration: "40 min" },
      ]),
      requirements: j(["C programming basics", "STM32 board (Blue Pill ok)"]),
      projectsIncluded: j(["Multi-channel Data Logger", "Real-time Signal Sampler"]),
      componentsRequired: j(["STM32 board", "ST-Link programmer", "Sensors"]),
      price: 69.99, videoUrl: "https://www.youtube.com/embed/placeholderc4",
      featured: false, rating: 4.8, reviewCount: 156,
    },
  ];

  for (const c of courses) {
    await db.course.create({ data: c });
  }

  // ----- Downloads -----
  const downloads = [
    { slug: "smart-home-source", title: "Smart Home — Arduino Source Code", description: "Full ESP32 Arduino sketch for the smart home automation project.", category: "Source Code", fileType: "zip", fileSize: "2.4 MB", fileUrl: "https://github.com/kbscircuit/smart-home/archive/main.zip" },
    { slug: "weather-station-source", title: "Weather Station — Arduino Sketch", description: "Arduino sketch for the weather station using BME280 + OLED.", category: "Source Code", fileType: "ino", fileSize: "18 KB", fileUrl: "https://github.com/kbscircuit/weather-station/raw/main/weather.ino" },
    { slug: "esp32-datasheet", title: "ESP32 Datasheet (Official)", description: "Official ESP32 technical reference manual from Espressif.", category: "Datasheet", fileType: "pdf", fileSize: "12.8 MB", fileUrl: "https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf" },
    { slug: "arduino-uno-datasheet", title: "Arduino Uno R3 Schematic", description: "Official Arduino Uno R3 schematic and reference design.", category: "Datasheet", fileType: "pdf", fileSize: "1.2 MB", fileUrl: "https://example.com/arduino-uno-schematic.pdf" },
    { slug: "smart-home-pcb", title: "Smart Home — PCB Gerber Files", description: "Gerber files ready for fabrication of the smart home PCB.", category: "PCB", fileType: "zip", fileSize: "820 KB", fileUrl: "https://github.com/kbscircuit/smart-home/raw/main/pcb/gerbers.zip" },
    { slug: "line-follower-pcb", title: "Line Follower Robot — PCB Files", description: "KiCad project and Gerbers for the line-following robot.", category: "PCB", fileType: "zip", fileSize: "1.1 MB", fileUrl: "https://github.com/kbscircuit/line-follower/raw/main/pcb.zip" },
    { slug: "esp32-iot-manual", title: "ESP32 IoT Course — Lab Manual", description: "Printable lab manual for the ESP32 IoT Bootcamp course.", category: "Manual", fileType: "pdf", fileSize: "4.5 MB", fileUrl: "https://example.com/esp32-iot-manual.pdf" },
    { slug: "pcb-design-slides", title: "PCB Design with KiCad — Slides", description: "Presentation slides accompanying the KiCad PCB design course.", category: "Slides", fileType: "pdf", fileSize: "6.2 MB", fileUrl: "https://example.com/pcb-design-slides.pdf" },
    { slug: "stm32-firmware-lib", title: "STM32 HAL Helper Library", description: "Reusable HAL helper functions for STM32 projects.", category: "Library", fileType: "zip", fileSize: "340 KB", fileUrl: "https://example.com/stm32-helpers.zip" },
    { slug: "dht22-driver", title: "DHT22 Sensor Driver Library", description: "Cross-platform C driver for DHT22 sensor (Arduino, ESP32, STM32).", category: "Library", fileType: "zip", fileSize: "120 KB", fileUrl: "https://example.com/dht22-driver.zip" },
  ];
  for (const d of downloads) {
    await db.download.create({ data: d });
  }

  // ----- Blog posts -----
  const posts = [
    {
      slug: "getting-started-with-arduino",
      title: "Getting Started with Arduino: A Beginner's Roadmap",
      excerpt: "Everything you need to know to go from zero to your first working Arduino project this weekend.",
      content: "# Getting Started with Arduino\n\nArduino is the perfect gateway into electronics and embedded programming. In this guide, we cover the essentials: choosing your first board, setting up the IDE, blinking an LED, and reading a sensor.\n\n## 1. Pick a Board\nThe Arduino Uno R3 is the most beginner-friendly option...\n\n## 2. Install the Arduino IDE\nDownload the IDE from arduino.cc...\n\n## 3. Blink an LED\nOpen File > Examples > 01.Basics > Blink...\n\n## 4. Read a Sensor\nTry a DHT22 for temperature and humidity...\n\n## Next Steps\nOnce comfortable, try a small project like a weather station.",
      cover: img("blog-arduino", 1200, 600), author: "David Chen", category: "Arduino", tags: j(["Arduino", "Beginner", "Tutorial"]), readTime: "8 min",
    },
    {
      slug: "esp32-vs-arduino",
      title: "ESP32 vs Arduino: Which Board Should You Choose?",
      excerpt: "A practical comparison of processing power, connectivity, and use-cases for two of the most popular boards.",
      content: "# ESP32 vs Arduino\n\nBoth boards are excellent, but they serve different needs...\n\n## Processing Power\nESP32 runs at 240MHz dual-core; Arduino Uno at 16MHz single-core.\n\n## Connectivity\nESP32 has built-in Wi-Fi and Bluetooth; Arduino Uno has none.\n\n## Ecosystem\nArduino has the largest beginner community; ESP32 dominates IoT.\n\n## Recommendation\nChoose Arduino for learning basics, ESP32 for connected projects.",
      cover: img("blog-vs", 1200, 600), author: "Aisha Rahman", category: "ESP32", tags: j(["ESP32", "Arduino", "Comparison"]), readTime: "6 min",
    },
    {
      slug: "pcb-design-tips",
      title: "10 PCB Design Tips for Beginners",
      excerpt: "Avoid the most common mistakes in your first PCB designs with these practical tips.",
      content: "# 10 PCB Design Tips\n\n1. Keep traces short.\n2. Use ground planes.\n3. Mind trace width for current.\n4. Decouple your ICs.\n5. Avoid 90° angles.\n6. Place capacitors close.\n7. Group related components.\n8. Label everything.\n9. Run DRC often.\n10. Order a small batch first.",
      cover: img("blog-pcb", 1200, 600), author: "Michael Torres", category: "PCB Design", tags: j(["PCB", "KiCad", "Tips"]), readTime: "5 min",
    },
    {
      slug: "understanding-i2c-spi",
      title: "Understanding I2C and SPI: Serial Communication Explained",
      excerpt: "A clear, visual explanation of the two most common sensor communication protocols.",
      content: "# I2C vs SPI\n\nBoth are serial protocols to talk to sensors and peripherals...\n\n## I2C\nTwo wires (SDA, SCL), addressing by ID, slower but simple wiring.\n\n## SPI\nFour wires (MOSI, MISO, SCK, CS), faster, one CS per device.\n\n## When to use which?\nUse I2C for few devices and simple wiring. Use SPI for speed and multiple devices.",
      cover: img("blog-comm", 1200, 600), author: "Liam O'Brien", category: "Embedded C", tags: j(["I2C", "SPI", "Communication"]), readTime: "7 min",
    },
    {
      slug: "power-supply-basics",
      title: "Power Supply Basics for Embedded Projects",
      excerpt: "Voltage regulators, buck/boost converters, and how to power your project reliably.",
      content: "# Power Supply Basics\n\nPowering projects correctly is critical for stability...\n\n## Linear vs Switching\nLinear regulators (7805) are simple but inefficient. Switching (buck/boost) converters are efficient.\n\n## Battery Choices\nLiPo for portable, USB for benchtop.\n\n## Decoupling\nAlways add capacitors near ICs.",
      cover: img("blog-power", 1200, 600), author: "David Chen", category: "Electronics Basics", tags: j(["Power", "Regulator", "Battery"]), readTime: "6 min",
    },
  ];
  for (const p of posts) {
    await db.blogPost.create({ data: p });
  }

  // ----- Reviews -----
  const reviewData = [
    { productSlug: "arduino-uno-r3", author: "John M.", rating: 5, comment: "Perfect board for learning. Works flawlessly." },
    { productSlug: "arduino-uno-r3", author: "Sara K.", rating: 4, comment: "Great quality, shipping was a bit slow." },
    { productSlug: "esp32-devkit-v1", author: "Mike T.", rating: 5, comment: "Incredible value for IoT projects. Highly recommend." },
    { productSlug: "esp32-devkit-v1", author: "Lina P.", rating: 5, comment: "Works great with Arduino IDE and ESP-IDF." },
    { productSlug: "raspberry-pi-4-4gb", author: "Chris D.", rating: 5, comment: "Powerful SBC. Runs everything I throw at it." },
    { productSlug: "smart-home-kit", author: "Amir R.", rating: 5, comment: "Complete kit, the video course was super helpful!" },
    { productSlug: "dht22-sensor", author: "Nina B.", rating: 4, comment: "Accurate readings, well-packaged." },
    { projectSlug: "smart-home-automation", author: "Tom W.", rating: 5, comment: "Excellent project guide. Got it working in a weekend." },
    { projectSlug: "weather-station", author: "Priya S.", rating: 5, comment: "Beginner-friendly and fun. Loved the wiring diagrams." },
    { projectSlug: "line-following-robot", author: "Kevin L.", rating: 4, comment: "Great intro to robotics. PID section was a bit fast." },
    { courseSlug: "arduino-fundamentals", author: "Grace H.", rating: 5, comment: "Best Arduino course I've taken. Clear and project-based." },
    { courseSlug: "esp32-iot-bootcamp", author: "Omar F.", rating: 5, comment: "MQTT section alone is worth the price. Amazing." },
    { courseSlug: "pcb-design-kicad", author: "Rita V.", rating: 4, comment: "Very thorough. Would love more advanced routing examples." },
  ];

  for (const r of reviewData) {
    await db.review.create({
      data: {
        author: r.author,
        rating: r.rating,
        comment: r.comment,
        productId: r.productSlug ? (await db.product.findUnique({ where: { slug: r.productSlug } }))?.id : null,
        projectId: r.projectSlug ? (await db.project.findUnique({ where: { slug: r.projectSlug } }))?.id : null,
        courseId: r.courseSlug ? (await db.course.findUnique({ where: { slug: r.courseSlug } }))?.id : null,
      },
    });
  }

  // ----- Orders -----
  await db.order.create({
    data: {
      orderNo: "KBS-2024-1001",
      userEmail: "student@example.com",
      userName: "Sam Student",
      total: 79.99,
      status: "delivered",
      items: j([{ name: "Smart Home IoT Project Kit", qty: 1, price: 79.99 }]),
    },
  });
  await db.order.create({
    data: {
      orderNo: "KBS-2024-1002",
      userEmail: "student@example.com",
      userName: "Sam Student",
      total: 30.98,
      status: "shipped",
      items: j([
        { name: "Arduino Uno R3", qty: 1, price: 24.99 },
        { name: "DHT22 Sensor", qty: 1, price: 4.99 },
      ]),
    },
  });
  await db.order.create({
    data: {
      orderNo: "KBS-2024-1003",
      userEmail: "student@example.com",
      userName: "Sam Student",
      total: 9.99,
      status: "processing",
      items: j([{ name: "ESP32-CAM Module", qty: 1, price: 9.99 }]),
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
