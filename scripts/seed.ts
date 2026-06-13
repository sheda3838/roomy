import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seed() {
  const dbConnect = (await import("../lib/db")).default;
  const User = (await import("../models/User")).default;
  const Room = (await import("../models/Room")).default;
  const Connection = (await import("../models/Connection")).default;
  const Message = (await import("../models/Message")).default;
  const RoomRequest = (await import("../models/RoomRequest")).default;

  await dbConnect();
  console.log("Connected to MongoDB. Clearing existing data...");

  await User.deleteMany({});
  await Room.deleteMany({});
  await Connection.deleteMany({});
  await Message.deleteMany({});
  await RoomRequest.deleteMany({});

  console.log("Existing data cleared. Starting seed...");

  const hashedPassword = await bcrypt.hash("password", 10);

  // --- USERS ---
  const usersData = [
    {
      fullName: "Kasun Perera", email: "user1@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849283/u1_uzlzhs.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "male", roleType: "student",
      cleanlinessLevel: "high", sleepType: "early", smoker: false, drinker: false, guestPolicy: "no",
      isActiveSeeker: true, preferredLocations: ["Colombo 03", "Colombo 04"],
      preferredFacilities: ["study_table", "bed_provided", "attached_washroom", "air_conditioning"],
      budgetMin: 15000, budgetMax: 25000, isOnboardingComplete: true
    },
    {
      fullName: "Nimali Silva", email: "user2@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849287/u2_zr8a8m.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "female", roleType: "student",
      cleanlinessLevel: "medium", sleepType: "early", smoker: false, drinker: false, guestPolicy: "often",
      isActiveSeeker: true, preferredLocations: ["Colombo 06"],
      preferredFacilities: ["kitchen_access", "laundry", "study_table"],
      budgetMin: 20000, budgetMax: 30000, isOnboardingComplete: true
    },
    {
      fullName: "Dinesh Fernando", email: "user3@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849282/u3_xx8vsd.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "male", roleType: "worker",
      cleanlinessLevel: "high", sleepType: "early", smoker: false, drinker: false, guestPolicy: "no",
      isActiveSeeker: true, preferredLocations: ["Colombo 05", "Colombo 06"],
      preferredFacilities: ["parking", "air_conditioning", "hot_water", "attached_washroom"],
      budgetMin: 30000, budgetMax: 50000, isOnboardingComplete: true
    },
    {
      fullName: "Sanduni Rajapaksha", email: "user4@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849282/u4_aqzf45.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "female", roleType: "student",
      cleanlinessLevel: "high", sleepType: "early", smoker: false, drinker: false, guestPolicy: "no",
      isActiveSeeker: true, preferredLocations: ["Colombo 06", "Kalutara"],
      preferredFacilities: ["study_table", "kitchen_access", "meals_provided"],
      budgetMin: 20000, budgetMax: 30000, isOnboardingComplete: true
    },
    {
      fullName: "Nuwan Jayasuriya", email: "user5@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849287/u5_ca8qfj.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "male", roleType: "student",
      cleanlinessLevel: "high", sleepType: "early", smoker: false, drinker: false, guestPolicy: "no",
      isActiveSeeker: true, preferredLocations: ["Colombo 03", "Colombo 04"],
      preferredFacilities: ["study_table", "bed_provided", "air_conditioning"],
      budgetMin: 15000, budgetMax: 25000, isOnboardingComplete: true
    },
    {
      fullName: "Chamari Bandara", email: "user6@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849285/u6_lhpsmc.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "female", roleType: "worker",
      cleanlinessLevel: "high", sleepType: "early", smoker: false, drinker: false, guestPolicy: "no",
      isActiveSeeker: true, preferredLocations: ["Colombo 07", "Colombo 04"],
      preferredFacilities: ["air_conditioning", "parking", "attached_washroom", "kitchen_access"],
      budgetMin: 35000, budgetMax: 50000, isOnboardingComplete: true
    },
    {
      fullName: "Thilina Wijesinghe", email: "user7@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849282/u7_nkvvd4.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "male", roleType: "student",
      cleanlinessLevel: "low", sleepType: "night_owl", smoker: true, drinker: true, guestPolicy: "regular",
      isActiveSeeker: true, preferredLocations: ["Colombo 05", "Colombo 06"],
      preferredFacilities: ["bed_provided", "meals_provided"],
      budgetMin: 10000, budgetMax: 20000, isOnboardingComplete: true
    },
    {
      fullName: "Koshala Gunawardena", email: "user8@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849287/u8_apclcp.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "female", roleType: "worker",
      cleanlinessLevel: "high", sleepType: "night_owl", smoker: false, drinker: true, guestPolicy: "often",
      isActiveSeeker: true, preferredLocations: ["Colombo 07", "Colombo 03"],
      preferredFacilities: ["attached_washroom", "air_conditioning", "parking"],
      budgetMin: 40000, budgetMax: 60000, isOnboardingComplete: true
    },
    {
      fullName: "Asela Rathnayake", email: "user9@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849284/u9_owyyvx.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "male", roleType: "worker",
      cleanlinessLevel: "medium", sleepType: "night_owl", smoker: true, drinker: false, guestPolicy: "often",
      isActiveSeeker: true, preferredLocations: ["Colombo 05", "Colombo 06"],
      preferredFacilities: ["parking", "hot_water", "own_cupboard"],
      budgetMin: 40000, budgetMax: 60000, isOnboardingComplete: true
    },
    {
      fullName: "Hasini Dissanayake", email: "user10@gmail.com", password: hashedPassword,
      profilePicture: "https://res.cloudinary.com/do7ovigcm/image/upload/v1779849288/u10_mbaohm.jpg",
      authProvider: "credentials", emailVerified: true, emailVerifiedAt: new Date(),
      gender: "female", roleType: "student",
      cleanlinessLevel: "low", sleepType: "night_owl", smoker: true, drinker: true, guestPolicy: "regular",
      isActiveSeeker: true, preferredLocations: ["Colombo 06"],
      preferredFacilities: ["kitchen_access", "laundry"],
      budgetMin: 30000, budgetMax: 40000, isOnboardingComplete: true
    }
  ];

  console.log("Creating 10 users...");
  const users = await User.insertMany(usersData);
  const u = {
    u1: users[0], u2: users[1], u3: users[2], u4: users[3], u5: users[4],
    u6: users[5], u7: users[6], u8: users[7], u9: users[8], u10: users[9]
  };

  // --- ROOMS ---
  const roomsData = [
    {
      title: "Cozy Shared Room for Students", description: "A great place for a disciplined student looking to study and relax. Quiet environment in Colombo 03.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779743947/1658301040_7796f3aa4d7819a2f5d5_q9xf6m.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779743953/Gemini_Generated_Image_y99brty99brty99b_lcgsgr.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779743950/Gemini_Generated_Image_abbqzkabbqzkabbq_f6zfso.jpg"
      ],
      ownerId: u.u1._id, locationText: "Colombo 03", rentAmount: 20000, capacity: 2, currentOccupants: 1, occupantIds: [u.u1._id],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: false, guestPolicy: "no",
      genderPreference: "male", occupationPreference: "student",
      providedFacilities: ["study_table", "bed_provided", "air_conditioning", "attached_washroom"],
      isActive: true, slug: "cozy-shared-room-colombo-03"
    },
    {
      title: "Spacious Girls Dorm in Colombo 06", description: "Large 6-person dorm room ideal for female students. Very safe and convenient location.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744042/Gemini_Generated_Image_6xnch86xnch86xnc_gxdwsw.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744043/Gemini_Generated_Image_lzfuzrlzfuzrlzfu_u8jpcx.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744042/hostel-room-types-12_bfxdb3.jpg"
      ],
      ownerId: u.u2._id, locationText: "Colombo 06", rentAmount: 25000, capacity: 6, currentOccupants: 2, occupantIds: [u.u2._id, u.u4._id],
      cleanlinessExpectation: "medium", smokerAllowed: false, drinkerAllowed: false, guestPolicy: "often",
      genderPreference: "female", occupationPreference: "student",
      providedFacilities: ["kitchen_access", "laundry", "study_table", "own_cupboard", "bed_provided"],
      isActive: true, slug: "girls-dorm-colombo-06-6-person"
    },
    {
      title: "Premium Men's Worker Hostel", description: "Executive style shared accommodation for working professionals in Colombo 05. Very premium.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744079/Gemini_Generated_Image_orbtq3orbtq3orbt_kljme0.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744080/Gemini_Generated_Image_r6yox4r6yox4r6yo_v1zmzg.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744080/71b5fb13-a851-44c8-870a-af63391e_lmsoia.jpg"
      ],
      ownerId: u.u3._id, locationText: "Colombo 05", rentAmount: 45000, capacity: 8, currentOccupants: 3, occupantIds: [u.u3._id, u.u9._id],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: false, guestPolicy: "no",
      genderPreference: "male", occupationPreference: "worker",
      providedFacilities: ["parking", "air_conditioning", "hot_water", "attached_washroom", "own_cupboard", "bed_provided"],
      isActive: true, slug: "premium-mens-worker-colombo-05"
    },
    {
      title: "Bright Room for 2 Students", description: "Beautiful bright room, perfect for two students to share. Currently completely vacant and ready.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744149/simple-and-bright-room-for-two-students-in-a-student-dormitory-ai-generative-photo_kz1h5v.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744150/Gemini_Generated_Image_5yzn405yzn405yzn_bsen46.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744149/Gemini_Generated_Image_c0jxt1c0jxt1c0jx_ut8dcf.jpg"
      ],
      ownerId: u.u1._id, locationText: "Colombo 04", rentAmount: 18000, capacity: 2, currentOccupants: 0, occupantIds: [],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: false, guestPolicy: "no",
      genderPreference: "male", occupationPreference: "student",
      providedFacilities: ["study_table", "bed_provided"],
      isActive: true, slug: "bright-room-colombo-04"
    },
    {
      title: "Cozy Female Room Colombo 06", description: "Cozy 2-person room in Colombo 06. Looking for a neat female roommate.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744276/679578356_pvjgti.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744276/Gemini_Generated_Image_gnzj0ognzj0ognzj_zww5zh.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744276/Gemini_Generated_Image_99imn599imn599im_csrbtz.jpg"
      ],
      ownerId: u.u2._id, locationText: "Colombo 06", rentAmount: 22000, capacity: 2, currentOccupants: 1, occupantIds: [u.u2._id],
      cleanlinessExpectation: "medium", smokerAllowed: false, drinkerAllowed: false, guestPolicy: "regular",
      genderPreference: "female", occupationPreference: "student",
      providedFacilities: ["bed_provided", "own_cupboard", "laundry"],
      isActive: true, slug: "cozy-female-colombo-06"
    },
    {
      title: "Modern Mixed Setup Colombo 04", description: "Modern shared space in Colombo 04. Open to any students.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744315/banner_dkummn.webp",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744313/Gemini_Generated_Image_kgpk22kgpk22kgpk_hskgna.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744312/Gemini_Generated_Image_kgpk22kgpk22ddedkgpk_u0rjgt.jpg"
      ],
      ownerId: u.u4._id, locationText: "Colombo 04", rentAmount: 28000, capacity: 2, currentOccupants: 0, occupantIds: [],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: false, guestPolicy: "often",
      genderPreference: "any", occupationPreference: "student",
      providedFacilities: ["air_conditioning", "study_table", "kitchen_access", "bed_provided"],
      isActive: true, slug: "modern-mixed-colombo-04"
    },
    {
      title: "Large Male Student Hostel Colombo 06", description: "Very affordable large hostel in Colombo 06. Meals included. Very relaxed rules.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744371/686644681_zbyqex.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744370/Gemini_Generated_Image_bva6a0bva6a0bva6_z0ann3.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744371/wv_dhq8vn.jpg"
      ],
      ownerId: u.u5._id, locationText: "Colombo 06", rentAmount: 12000, capacity: 8, currentOccupants: 3, occupantIds: [u.u5._id, u.u7._id],
      cleanlinessExpectation: "low", smokerAllowed: true, drinkerAllowed: true, guestPolicy: "regular",
      genderPreference: "male", occupationPreference: "student",
      providedFacilities: ["meals_provided", "bed_provided", "study_table", "hot_water"],
      isActive: true, slug: "large-male-hostel-colombo-06"
    },
    {
      title: "Premium Female Worker Dorm", description: "Safe and luxurious dorm for working females in Colombo 07.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744428/Gemini_Generated_Image_4vimxs4vimxs4vim_gkmz5g.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744427/Gemini_Generated_Image_fs6jn4fs6jn4fs6j_xf3ey2.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744426/907615_17012620080050599631_gfalrs.jpg"
      ],
      ownerId: u.u6._id, locationText: "Colombo 07", rentAmount: 40000, capacity: 10, currentOccupants: 4, occupantIds: [u.u6._id, u.u8._id],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: false, guestPolicy: "no",
      genderPreference: "female", occupationPreference: "worker",
      providedFacilities: ["air_conditioning", "parking", "attached_washroom", "kitchen_access", "laundry"],
      isActive: true, slug: "premium-female-worker-colombo-07"
    },
    {
      title: "Budget Boys Hostel Gampaha", description: "Budget friendly 12 bed hostel. Casual environment.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744514/360_F_219669327_v12pBKc7TB62E3uCJrgRRkDhfVENK3z5_hl1pl2.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744514/Gemini_Generated_Image_nkma6pnkma6pnkma_ekbwx8.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744514/Gemini_Generated_Image_gq1aixgq1aixgq1a_h3rrx6.jpg"
      ],
      ownerId: u.u7._id, locationText: "Gampaha", rentAmount: 10000, capacity: 12, currentOccupants: 10, occupantIds: [u.u7._id],
      cleanlinessExpectation: "low", smokerAllowed: true, drinkerAllowed: true, guestPolicy: "regular",
      genderPreference: "male", occupationPreference: "student",
      providedFacilities: ["bed_provided", "meals_provided"],
      isActive: true, slug: "budget-boys-hostel-gampaha"
    },
    {
      title: "Shared 3-Person Female Room Kalutara", description: "Nice view. 3 bed room for female students.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744479/Hostel-Room-scaled_ecehjb.webp",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744478/Gemini_Generated_Image_lnaglrlnaglrlnag_jcvbtk.jpg"
      ],
      ownerId: u.u4._id, locationText: "Kalutara", rentAmount: 26000, capacity: 3, currentOccupants: 1, occupantIds: [u.u4._id],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: false, guestPolicy: "often",
      genderPreference: "female", occupationPreference: "student",
      providedFacilities: ["kitchen_access", "laundry", "study_table"],
      isActive: true, slug: "shared-3-female-kalutara"
    },
    {
      title: "6-Bed Mixed Worker Setup", description: "Mixed gender worker dorm. Very professional environment.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744558/hi-los-angeles-santa_fyditz.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744559/Gemini_Generated_Image_8zj3dy8zj3dy8zj3_ftkbz2.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744559/Gemini_Generated_Image_wlb6ptwlb6ptwlb6_eedbb4.jpg"
      ],
      ownerId: u.u6._id, locationText: "Colombo 03", rentAmount: 38000, capacity: 6, currentOccupants: 0, occupantIds: [],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: true, guestPolicy: "regular",
      genderPreference: "any", occupationPreference: "worker",
      providedFacilities: ["air_conditioning", "parking", "attached_washroom", "kitchen_access"],
      isActive: true, slug: "6-bed-mixed-worker-colombo-03"
    },
    {
      title: "Female Only 6-Bed Room", description: "Safe area, close to main road. Ideal for night shifts.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744591/dorm2_ouylwh.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744590/Gemini_Generated_Image_cgw636cgw636cgw6_obuiqw.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744589/Gemini_Generated_Image_jwxgnyjwxgnyjwxg_lxtbxt.jpg"
      ],
      ownerId: u.u8._id, locationText: "Colombo 07", rentAmount: 35000, capacity: 6, currentOccupants: 1, occupantIds: [u.u8._id],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: true, guestPolicy: "often",
      genderPreference: "female", occupationPreference: "worker",
      providedFacilities: ["attached_washroom", "air_conditioning", "laundry"],
      isActive: true, slug: "female-only-6-bed-colombo-07"
    },
    {
      title: "Executive 2-Person Shared Room", description: "High-end twin room for workers. Quite pricey but worth it.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744626/Gemini_Generated_Image_483pdi483pdi483p_iifsn1.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744625/Gemini_Generated_Image_r5u55nr5u55nr5u5_l7qoij.jpg"
      ],
      ownerId: u.u9._id, locationText: "Colombo 05", rentAmount: 55000, capacity: 2, currentOccupants: 1, occupantIds: [u.u9._id],
      cleanlinessExpectation: "high", smokerAllowed: true, drinkerAllowed: false, guestPolicy: "often",
      genderPreference: "male", occupationPreference: "worker",
      providedFacilities: ["parking", "hot_water", "own_cupboard", "air_conditioning", "attached_washroom"],
      isActive: true, slug: "executive-2-person-colombo-05"
    },
    {
      title: "Colombo 06 3-Bed Female Room", description: "Affordable and close to the junction.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744660/big_20230227_120938_qlwsgl.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744660/Gemini_Generated_Image_98lefq98lefq98le_ld3op5.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744657/Gemini_Generated_Image_ft40f7ft40f7ft40_ww2wnc.jpg"
      ],
      ownerId: u.u10._id, locationText: "Colombo 06", rentAmount: 28000, capacity: 3, currentOccupants: 1, occupantIds: [u.u10._id],
      cleanlinessExpectation: "low", smokerAllowed: true, drinkerAllowed: true, guestPolicy: "regular",
      genderPreference: "female", occupationPreference: "student",
      providedFacilities: ["kitchen_access", "laundry", "bed_provided", "own_cupboard"],
      isActive: true, slug: "colombo-06-3-bed-female"
    },
    {
      title: "Mixed 8-Bed Startup House", description: "Great for networking. Lots of working professionals.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744686/Gemini_Generated_Image_ufv5pfufv5pfufv5_jylos0.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744685/Gemini_Generated_Image_nvxseonvxseonvxs_uxklys.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744689/hostel-colors-of-adriatic-youth-only-split-photo-26_eodwqu.jpg"
      ],
      ownerId: u.u8._id, locationText: "Colombo 07", rentAmount: 32000, capacity: 8, currentOccupants: 0, occupantIds: [],
      cleanlinessExpectation: "high", smokerAllowed: false, drinkerAllowed: true, guestPolicy: "often",
      genderPreference: "any", occupationPreference: "worker",
      providedFacilities: ["parking", "air_conditioning", "hot_water", "kitchen_access"],
      isActive: true, slug: "mixed-8-bed-startup-house-colombo-07"
    },
    {
      title: "Colombo 05 8-Bed Men's Dorm", description: "Convenient location for workers in the area. Very active lifestyle.",
      images: [
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744719/Gemini_Generated_Image_g94f0cg94f0cg94f_zujuhr.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744720/Gemini_Generated_Image_kkevf4kkevf4kkev_harciy.jpg",
        "https://res.cloudinary.com/do7ovigcm/image/upload/v1779744720/6-2-42ee987ce8ab6f796e5574af8182f5de-04b7430e925c5be74e81f942ff2d53ae_onk1ej.webp"
      ],
      ownerId: u.u9._id, locationText: "Colombo 05", rentAmount: 30000, capacity: 8, currentOccupants: 1, occupantIds: [u.u9._id],
      cleanlinessExpectation: "medium", smokerAllowed: true, drinkerAllowed: false, guestPolicy: "often",
      genderPreference: "male", occupationPreference: "worker",
      providedFacilities: ["parking", "hot_water", "own_cupboard", "bed_provided", "laundry"],
      isActive: true, slug: "colombo-05-8-bed-mens-dorm"
    }
  ];

  console.log("Creating 16 rooms...");
  const rooms = await Room.insertMany(roomsData);

  // Helper to find room by slug
  const getRoom = (slug: string) => rooms.find(r => r.slug === slug)!;

  // --- CONNECTIONS ---
  console.log("Creating Connections...");
  const connectionsData = [
    // u1 and u5 (High compatibility - Room1 roommates)
    { users: [u.u1._id, u.u5._id], roomId: getRoom("cozy-shared-room-colombo-03")._id, isActive: true },
    // u2 and u4 (70-80% match - Room2 roommates)
    { users: [u.u2._id, u.u4._id], roomId: getRoom("girls-dorm-colombo-06-6-person")._id, isActive: true },
    // u3 and u9 (Workers - Room3 roommates)
    { users: [u.u3._id, u.u9._id], roomId: getRoom("premium-mens-worker-colombo-05")._id, isActive: true },
    // u6 and u8 (Female Workers - Room8 roommates)
    { users: [u.u6._id, u.u8._id], roomId: getRoom("premium-female-worker-colombo-07")._id, isActive: true },
    // u7 and u10 (Low match, but connected for testing)
    { users: [u.u7._id, u.u10._id], isActive: true },
    // u1 and u3 (Just general connection)
    { users: [u.u1._id, u.u3._id], isActive: true },
  ];

  const connections = await Connection.insertMany(connectionsData);

  // --- MESSAGES ---
  console.log("Creating Messages...");
  const messagesData: unknown[] = [];
  const baseTime = new Date();

  function addChat(connectionId: unknown, senderId: unknown, receiverId: unknown, msgs: string[]) {
    msgs.forEach((content, index) => {
      const isSender = index % 2 === 0;
      messagesData.push({
        connectionId,
        senderId: isSender ? senderId : receiverId,
        receiverId: isSender ? receiverId : senderId,
        content,
        messageType: "text",
        createdAt: new Date(baseTime.getTime() - (msgs.length - index) * 3600000), // hours ago
        updatedAt: new Date(baseTime.getTime() - (msgs.length - index) * 3600000),
      });
    });
  }

  // Chat 1: u1 and u5 (Roommate discussion)
  addChat(connections[0]._id, u.u5._id, u.u1._id, [
    "Hey Kasun, I saw your room in Colombo 03. Is it still available?",
    "Hi Nuwan, yes it is! When are you looking to move in?",
    "Ideally next week. I'm also a student. Do you have a study table?",
    "Yes, the room has a study table and AC. It's very quiet here.",
    "That sounds perfect for me. Can I come view it tomorrow?",
    "Sure, tomorrow evening at 5 PM works for me.",
    "Great, see you then!",
    "By the way, what about the internet connection?",
    "We have a fiber connection, it's very fast.",
    "Awesome. Looking forward to it."
  ]);

  // Chat 2: u2 and u4 (Girls Dorm discussion)
  addChat(connections[1]._id, u.u4._id, u.u2._id, [
    "Hi Nimali, your dorm in Colombo 06 looks nice.",
    "Thanks Sanduni! We currently have 2 beds free. Are you studying nearby?",
    "Yes, I go to a campus close by. How is the kitchen situation?",
    "We all share it. It's kept pretty clean.",
    "I like to cook my own meals, so that's great.",
    "You're welcome to use it anytime."
  ]);

  // Chat 3: u3 and u9 (Worker dorm)
  addChat(connections[2]._id, u.u9._id, u.u3._id, [
    "Hello Dinesh, I'm interested in the worker hostel.",
    "Hi Asela, sure. It's a premium spot. No smoking or drinking allowed inside.",
    "That's fine by me, I usually go out if I need to.",
    "Perfect. We value peace and quiet after work.",
    "Same here. Is there dedicated parking?",
    "Yes, each person gets a slot.",
    "Nice. I'll take it."
  ]);

  // Chat 4: u6 and u8 (Female worker dorm)
  addChat(connections[3]._id, u.u8._id, u.u6._id, [
    "Hey Chamari, is the Colombo 07 dorm still open?",
    "Hi Koshala! Yes, we have space.",
    "I work night shifts sometimes, is that okay?",
    "Absolutely, just try to be quiet when coming in late.",
    "Will do. Thanks!"
  ]);

  await Message.insertMany(messagesData);

  // --- ROOM REQUESTS ---
  console.log("Creating Room Requests...");
  const requestsData = [
    {
      fromUserId: u.u5._id, ownerId: u.u1._id, roomId: getRoom("cozy-shared-room-colombo-03")._id,
      type: "join_room", status: "accepted", message: "Hi Kasun, I'd like to join your room!"
    },
    {
      fromUserId: u.u7._id, ownerId: u.u1._id, roomId: getRoom("bright-room-colombo-04")._id,
      type: "join_room", status: "pending", message: "Hey man, is this room free?"
    },
    {
      fromUserId: u.u10._id, ownerId: u.u4._id, roomId: getRoom("modern-mixed-colombo-04")._id,
      type: "join_room", status: "pending", message: "Looks great, can I join?"
    },
    {
      fromUserId: u.u8._id, ownerId: u.u6._id, roomId: getRoom("premium-female-worker-colombo-07")._id,
      type: "join_room", status: "accepted", message: "I'd love to take one of the beds here."
    },
    {
      fromUserId: u.u7._id, ownerId: u.u3._id, roomId: getRoom("premium-mens-worker-colombo-05")._id,
      type: "join_room", status: "rejected", message: "Please let me join."
    }
  ];

  await RoomRequest.insertMany(requestsData);

  // --- UPDATE USERS WITH CONNECTIONS ---
  console.log("Updating Users with connection references...");
  
  // u1 connections
  u.u1.connectionIds = [connections[0]._id, connections[5]._id];
  await u.u1.save();

  // u5 connections
  u.u5.connectionIds = [connections[0]._id];
  await u.u5.save();

  // u2 connections
  u.u2.connectionIds = [connections[1]._id];
  await u.u2.save();

  // u4 connections
  u.u4.connectionIds = [connections[1]._id];
  await u.u4.save();

  // u3 connections
  u.u3.connectionIds = [connections[2]._id, connections[5]._id];
  await u.u3.save();

  // u9 connections
  u.u9.connectionIds = [connections[2]._id];
  await u.u9.save();

  // u6 connections
  u.u6.connectionIds = [connections[3]._id];
  await u.u6.save();

  // u8 connections
  u.u8.connectionIds = [connections[3]._id];
  await u.u8.save();

  // u7 connections
  u.u7.connectionIds = [connections[4]._id];
  await u.u7.save();

  // u10 connections
  u.u10.connectionIds = [connections[4]._id];
  await u.u10.save();

  console.log("Seeding complete! The application now has a rich set of realistic data.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
