import React, { useState, useEffect, useRef } from 'react';
import { Camera, Home, TrendingUp, User, Plus, Search, Target, Flame, Droplet, Apple, Brain, Calendar, Bell, LogOut, X, MessageSquare, Activity, Send, Smile, Mail, Lock, UserPlus, Sparkles, ChevronRight, Utensils, Clock, Trash2 } from 'lucide-react';

const NutriSnap = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', age: '', weight: '', height: '', targetWeight: '', gender: 'male', activityLevel: 'moderate'
  });

  const [currentView, setCurrentView] = useState('home');
  const [userData, setUserData] = useState(null);
  const [todayStats, setTodayStats] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0, water: 0, steps: 0 });
  const [meals, setMeals] = useState([]);
  const [coachMessages, setCoachMessages] = useState([]);
  const [showCoach, setShowCoach] = useState(false);
  
  const [coachInput, setCoachInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [manualFoodData, setManualFoodData] = useState({
    name: '', calories: '', protein: '', carbs: '', fats: '', quantity: 1, unit: 'serving'
  });
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const foodDatabase = [
    { name: 'Oatmeal', calories: 150, protein: 5, carbs: 27, fats: 3, unit: '100g' },
    { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0, unit: '1 medium' },
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 4, unit: '100g' },
    { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fats: 2, unit: '1 cup' },
    { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fats: 0, unit: '170g' },
    { name: 'Salmon', calories: 206, protein: 22, carbs: 0, fats: 13, unit: '100g' },
    { name: 'Almonds', calories: 170, protein: 6, carbs: 6, fats: 15, unit: '28g' },
    { name: 'Eggs', calories: 155, protein: 13, carbs: 1, fats: 11, unit: '2 large' },
    { name: 'Broccoli', calories: 31, protein: 3, carbs: 6, fats: 0, unit: '100g' },
    { name: 'Sweet Potato', calories: 86, protein: 2, carbs: 20, fats: 0, unit: '100g' },
    { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fats: 15, unit: '1/2 fruit' },
    { name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fats: 4, unit: '1 cup' },
    { name: 'Tuna', calories: 132, protein: 28, carbs: 0, fats: 1, unit: '100g' },
    { name: 'Apple', calories: 95, protein: 0, carbs: 25, fats: 0, unit: '1 medium' },
    { name: 'Peanut Butter', calories: 190, protein: 8, carbs: 7, fats: 16, unit: '2 tbsp' }
  ];

  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [coachMessages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [coachInput]);

  const calculateCalorieGoal = (weight, height, age, gender, activityLevel) => {
    let bmr = gender === 'male' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
    return Math.round(bmr * multipliers[activityLevel] - 500);
  };

  const addFoodFromDatabase = (food) => {
    const newMeal = {
      id: Date.now(),
      name: food.name,
      type: selectedMealType,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      unit: food.unit,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setMeals([...meals, newMeal]);
    setTodayStats({
      calories: todayStats.calories + food.calories,
      protein: todayStats.protein + food.protein,
      carbs: todayStats.carbs + food.carbs,
      fats: todayStats.fats + food.fats,
      water: todayStats.water,
      steps: todayStats.steps
    });
    setShowAddMeal(false);
    setSearchQuery('');
  };

  const addManualFood = () => {
    if (!manualFoodData.name || !manualFoodData.calories) {
      alert('Please fill in at least food name and calories');
      return;
    }

    const newMeal = {
      id: Date.now(),
      name: manualFoodData.name,
      type: selectedMealType,
      calories: parseInt(manualFoodData.calories) * manualFoodData.quantity,
      protein: parseInt(manualFoodData.protein || 0) * manualFoodData.quantity,
      carbs: parseInt(manualFoodData.carbs || 0) * manualFoodData.quantity,
      fats: parseInt(manualFoodData.fats || 0) * manualFoodData.quantity,
      quantity: manualFoodData.quantity,
      unit: manualFoodData.unit,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMeals([...meals, newMeal]);
    setTodayStats({
      calories: todayStats.calories + newMeal.calories,
      protein: todayStats.protein + newMeal.protein,
      carbs: todayStats.carbs + newMeal.carbs,
      fats: todayStats.fats + newMeal.fats,
      water: todayStats.water,
      steps: todayStats.steps
    });
    
    setShowManualEntry(false);
    setShowAddMeal(false);
    setManualFoodData({ name: '', calories: '', protein: '', carbs: '', fats: '', quantity: 1, unit: 'serving' });
  };

  const deleteMeal = (mealId) => {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      setTodayStats({
        calories: todayStats.calories - meal.calories,
        protein: todayStats.protein - meal.protein,
        carbs: todayStats.carbs - meal.carbs,
        fats: todayStats.fats - meal.fats,
        water: todayStats.water,
        steps: todayStats.steps
      });
      setMeals(meals.filter(m => m.id !== mealId));
    }
  };

  const generateAdvancedResponse = (msg) => {
    const m = msg.toLowerCase();
    const firstName = userData.name.split(' ')[0];
    
    if (m.match(/hi|hello|hey/)) {
      return `Hey ${firstName}! 😊\n\nGreat to hear from you! I'm here to support your wellness journey. What would you like to talk about today?`;
    }
    
    if (m.match(/tired|exhausted|low energy/)) {
      return `I hear you ${firstName} 😔\n\nLet's boost your energy:\n\n**Current Stats:**\n• Protein: ${todayStats.protein}g/${userData.proteinGoal}g\n• Calories: ${todayStats.calories}/${userData.dailyCalorieGoal}\n\n**Quick Energy Boosters:**\n🥚 Hard-boiled eggs (78 cal, 6g protein)\n🍌 Banana with almond butter (190 cal)\n🥤 Protein smoothie (250 cal, 25g protein)\n\nWhat sounds good?`;
    }
    
    if (m.match(/meal|dinner|lunch|breakfast|eat/)) {
      const remaining = userData.dailyCalorieGoal - todayStats.calories;
      return `I'd love to help plan your meal! 🍳\n\n**Available Calories:** ${remaining}\n\n**🌅 Breakfast (350 cal):**\n• Protein oatmeal with berries\n• Veggie omelet with toast\n\n**🥗 Lunch (450 cal):**\n• Chicken Caesar salad\n• Quinoa bowl with veggies\n\n**🍽️ Dinner (550 cal):**\n• Salmon with asparagus\n• Chicken with sweet potato\n\nWhich meal are you planning?`;
    }
    
    if (m.match(/protein/)) {
      const left = userData.proteinGoal - todayStats.protein;
      return `Let's talk protein! 💪\n\n**Status:**\n• Current: ${todayStats.protein}g\n• Goal: ${userData.proteinGoal}g\n• Remaining: ${left}g\n\n**Top Sources:**\n🍗 Chicken: 31g per 100g\n🐟 Salmon: 25g per 100g\n🥚 Greek yogurt: 17g per cup\n\nWhich would you like to add?`;
    }
    
    return `I'm here to help! 😊\n\n**Your Stats Today:**\n• Calories: ${todayStats.calories}/${userData.dailyCalorieGoal}\n• Protein: ${todayStats.protein}g/${userData.proteinGoal}g\n• Water: ${todayStats.water}/8\n\nWhat would you like to know?`;
  };

  const handleSignup = () => {
    if (!signupData.name || !signupData.email || !signupData.age || !signupData.weight) {
      alert('Please fill all fields');
      return;
    }

    const cal = calculateCalorieGoal(parseFloat(signupData.weight), parseFloat(signupData.height), parseInt(signupData.age), signupData.gender, signupData.activityLevel);
    const newUser = {
      name: signupData.name, email: signupData.email, weight: parseFloat(signupData.weight), targetWeight: parseFloat(signupData.targetWeight),
      height: parseFloat(signupData.height), age: parseInt(signupData.age), gender: signupData.gender, activityLevel: signupData.activityLevel,
      dailyCalorieGoal: cal, proteinGoal: Math.round(cal*0.3/4), carbsGoal: Math.round(cal*0.4/4), fatsGoal: Math.round(cal*0.3/9),
      coachName: 'Emma', joinDate: new Date().toLocaleDateString()
    };

    setUserData(newUser);
    setIsAuthenticated(true);
    setCoachMessages([{ 
      id: 1, type: 'ai', 
      message: `Welcome ${newUser.name}! 🎉\n\nI'm Coach Emma. Your daily goal is ${cal} calories. Let's achieve your target of ${newUser.targetWeight}kg together!`, 
      time: new Date().toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'})
    }]);
  };

  const handleLogin = () => {
    if (!loginData.email) {
      alert('Please enter email');
      return;
    }

    const demo = {
      name: 'Alex Johnson', email: loginData.email, weight: 75, targetWeight: 70, height: 175, age: 28, gender: 'male',
      activityLevel: 'moderate', dailyCalorieGoal: 2000, proteinGoal: 150, carbsGoal: 200, fatsGoal: 65, coachName: 'Emma', joinDate: 'Jan 15, 2025'
    };

    setUserData(demo);
    setIsAuthenticated(true);
    setTodayStats({ calories: 850, protein: 57, carbs: 103, fats: 19, water: 4, steps: 5420 });
    setMeals([
      {id:1, name:'Oatmeal with Berries', type:'Breakfast', calories:350, protein:12, carbs:58, fats:8, time:'08:30 AM'},
      {id:2, name:'Greek Yogurt', type:'Snack', calories:100, protein:17, carbs:6, fats:0, time:'10:30 AM'},
      {id:3, name:'Grilled Chicken Salad', type:'Lunch', calories:400, protein:28, carbs:39, fats:11, time:'01:00 PM'}
    ]);
    setCoachMessages([{ 
      id: 1, type: 'ai',
      message: `Welcome back ${demo.name}! 🌟\n\n**Today's Progress:**\n• Calories: 850/2000\n• Protein: 57g/150g\n• Water: 4/8 glasses\n\nYou're doing great! Need help with your next meal?`,
      time: new Date().toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'})
    }]);
  };

  const handleCoachMessage = () => {
    if (!coachInput.trim()) return;
    
    const userMsg = { 
      id: Date.now(), 
      type: 'user', 
      message: coachInput, 
      time: new Date().toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'}) 
    };
    
    setCoachMessages([...coachMessages, userMsg]);
    const inputCopy = coachInput;
    setCoachInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now()+1, 
        type: 'ai', 
        message: generateAdvancedResponse(inputCopy), 
        time: new Date().toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'}) 
      };
      setCoachMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFoodScan = () => {
    setShowCamera(true);
    setTimeout(() => {
      const food = {id:Date.now(), name:'Grilled Chicken', type:selectedMealType, calories:165, protein:31, carbs:0, fats:4, time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})};
      setMeals([...meals, food]);
      setTodayStats({...todayStats, calories:todayStats.calories+165, protein:todayStats.protein+31, fats:todayStats.fats+4});
      setShowCamera(false);
      setShowAddMeal(false);
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <Apple className="w-14 h-14 text-emerald-600" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-3">NutriSnap</h1>
            <p className="text-emerald-50 text-xl font-medium">AI-Powered Nutrition Tracking</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex gap-2 mb-6">
              <button onClick={()=>setShowLogin(true)} className={`flex-1 py-3 rounded-xl font-semibold transition-all ${showLogin?'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg':'bg-gray-100 text-gray-600'}`}>Login</button>
              <button onClick={()=>setShowLogin(false)} className={`flex-1 py-3 rounded-xl font-semibold transition-all ${!showLogin?'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg':'bg-gray-100 text-gray-600'}`}>Sign Up</button>
            </div>

            {showLogin ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" value={loginData.email} onChange={(e)=>setLoginData({...loginData,email:e.target.value})} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="password" value={loginData.password} onChange={(e)=>setLoginData({...loginData,password:e.target.value})} placeholder="password" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
                  </div>
                </div>
                <button onClick={handleLogin} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all">Login</button>
                <p className="text-center text-sm text-gray-500">Demo: Use any email/password</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                <input type="text" value={signupData.name} onChange={(e)=>setSignupData({...signupData,name:e.target.value})} placeholder="Full Name" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={signupData.age} onChange={(e)=>setSignupData({...signupData,age:e.target.value})} placeholder="Age" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                  <select value={signupData.gender} onChange={(e)=>setSignupData({...signupData,gender:e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={signupData.weight} onChange={(e)=>setSignupData({...signupData,weight:e.target.value})} placeholder="Weight (kg)" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                  <input type="number" value={signupData.height} onChange={(e)=>setSignupData({...signupData,height:e.target.value})} placeholder="Height (cm)" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                </div>
                <input type="number" value={signupData.targetWeight} onChange={(e)=>setSignupData({...signupData,targetWeight:e.target.value})} placeholder="Target Weight (kg)" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                <select value={signupData.activityLevel} onChange={(e)=>setSignupData({...signupData,activityLevel:e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none">
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Active</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="veryActive">Very Active</option>
                </select>
                <input type="email" value={signupData.email} onChange={(e)=>setSignupData({...signupData,email:e.target.value})} placeholder="Email" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                <input type="password" value={signupData.password} onChange={(e)=>setSignupData({...signupData,password:e.target.value})} placeholder="Password" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                <button onClick={handleSignup} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all">
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const calPct = (todayStats.calories/userData.dailyCalorieGoal)*100;
  const proteinPct = (todayStats.protein/userData.proteinGoal)*100;
  const carbsPct = (todayStats.carbs/userData.carbsGoal)*100;
  const fatsPct = (todayStats.fats/userData.fatsGoal)*100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative pb-20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Apple className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">NutriSnap</h1>
                <p className="text-xs text-gray-500">Track. Analyze. Achieve.</p>
              </div>
            </div>
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors" />
          </div>

          {currentView==='home' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Hello, {userData.name.split(' ')[0]}! 👋</h2>
                    <p className="text-emerald-100">Stay consistent, achieve greatness</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-emerald-200" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Daily Calorie Goal</span>
                    <span className="text-lg font-bold">{todayStats.calories}/{userData.dailyCalorieGoal}</span>
                  </div>
                  <div className="bg-white/30 rounded-full h-4 overflow-hidden">
                    <div className="bg-white h-full rounded-full transition-all duration-500 shadow-inner" style={{width:`${Math.min(calPct,100)}%`}} />
                  </div>
                  <p className="text-xs text-emerald-100 mt-2">{userData.dailyCalorieGoal - todayStats.calories} calories remaining</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Macronutrients</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Protein</span>
                      <span className="text-sm font-bold text-purple-600">{todayStats.protein}g / {userData.proteinGoal}g</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all" style={{width:`${Math.min(proteinPct,100)}%`}} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Carbs</span>
                      <span className="text-sm font-bold text-blue-600">{todayStats.carbs}g / {userData.carbsGoal}g</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all" style={{width:`${Math.min(carbsPct,100)}%`}} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Fats</span>
                      <span className="text-sm font-bold text-orange-600">{todayStats.fats}g / {userData.fatsGoal}g</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all" style={{width:`${Math.min(fatsPct,100)}%`}} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer" onClick={()=>setShowCoach(true)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Brain className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI Coach {userData.coachName}</h3>
                      <p className="text-sm text-purple-100">Get personalized advice</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center text-gray-800">
                    <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                    Today's Meals
                  </h3>
                  <span className="text-sm text-gray-500">{meals.length} items</span>
                </div>
                
                {meals.length>0 ? (
                  <div className="space-y-3">
                    {['Breakfast','Snack','Lunch','Dinner'].map(type=>{
                      const typeMeals = meals.filter(m=>m.type===type);
                      if(typeMeals.length===0) return null;
                      return (
                        <div key={type} className="border-b border-gray-100 pb-3 last:border-0">
                          <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                            <Utensils className="w-4 h-4 mr-1" />
                            {type}
                          </p>
                          {typeMeals.map(meal=>(
                            <div key={meal.id} className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-2 hover:shadow-md transition-all">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">{meal.time}</span>
                                  </div>
                                  <div className="flex gap-3 mt-2 text-xs">
                                    <span className="text-purple-600">P: {meal.protein}g</span>
                                    <span className="text-blue-600">C: {meal.carbs}g</span>
                                    <span className="text-orange-600">F: {meal.fats}g</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <p className="font-bold text-emerald-600 text-lg">{meal.calories}</p>
                                    <p className="text-xs text-gray-500">cal</p>
                                  </div>
                                  <button onClick={()=>deleteMeal(meal.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">No meals logged yet</p>
                    <p className="text-sm text-gray-400">Start tracking your nutrition!</p>
                  </div>
                )}
                
                <button onClick={()=>setShowAddMeal(true)} className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Meal
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-4 text-white shadow-lg">
                  <Droplet className="w-10 h-10 mb-2 opacity-90" />
                  <p className="text-3xl font-bold mb-1">{todayStats.water}/8</p>
                  <p className="text-sm font-medium opacity-90">Glasses</p>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
                  <Activity className="w-10 h-10 mb-2 opacity-90" />
                  <p className="text-3xl font-bold mb-1">{todayStats.steps}</p>
                  <p className="text-sm font-medium opacity-90">Steps</p>
                </div>
              </div>
            </div>
          )}

          {currentView==='progress' && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
              <div className="bg-gradient-to-br from-blue-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">Weight Journey</h3>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Current</p>
                    <p className="text-4xl font-bold">{userData.weight}</p>
                    <p className="text-sm">kg</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">{userData.weight-userData.targetWeight}kg to go</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100 mb-1">Target</p>
                    <p className="text-4xl font-bold">{userData.targetWeight}</p>
                    <p className="text-sm">kg</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView==='profile' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white text-center shadow-xl">
                <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold mb-1">{userData.name}</h2>
                <p className="text-emerald-100">Member since {userData.joinDate}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Personal Info</h3>
                <div className="space-y-3">
                  {[
                    {label:'Age',value:`${userData.age} years`},
                    {label:'Gender',value:userData.gender},
                    {label:'Weight',value:`${userData.weight} kg`},
                    {label:'Height',value:`${userData.height} cm`},
                    {label:'Target',value:`${userData.targetWeight} kg`},
                    {label:'Daily Goal',value:`${userData.dailyCalorieGoal} cal`}
                  ].map((item,i)=>(
                    <div key={i} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                      <span className="text-gray-600 font-medium">{item.label}</span>
                      <span className="font-semibold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={()=>{setIsAuthenticated(false);setUserData(null);}} className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-md mx-auto flex justify-around items-center py-3 px-6">
            <button onClick={()=>setCurrentView('home')} className={`flex flex-col items-center gap-1 p-2 ${currentView==='home'?'text-emerald-600':'text-gray-400'}`}>
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            <button onClick={()=>setCurrentView('progress')} className={`flex flex-col items-center gap-1 p-2 ${currentView==='progress'?'text-emerald-600':'text-gray-400'}`}>
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progress</span>
            </button>
            <button onClick={()=>setShowAddMeal(true)} className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full -mt-10 shadow-xl">
              <Plus className="w-7 h-7 text-white" />
            </button>
            <button onClick={()=>setShowCoach(true)} className="flex flex-col items-center gap-1 p-2 text-gray-400">
              <Brain className="w-6 h-6" />
              <span className="text-xs font-medium">Coach</span>
            </button>
            <button onClick={()=>setCurrentView('profile')} className={`flex flex-col items-center gap-1 p-2 ${currentView==='profile'?'text-emerald-600':'text-gray-400'}`}>
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>

        {showAddMeal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 max-w-md mx-auto shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5 sticky top-0 bg-white pb-4">
                <h3 className="text-xl font-bold">Add Meal</h3>
                <button onClick={()=>{setShowAddMeal(false);setSearchQuery('');}} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['Breakfast','Snack','Lunch','Dinner'].map(type=>(
                  <button key={type} onClick={()=>setSelectedMealType(type)} className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${selectedMealType===type?'bg-gradient-to-r from-emerald-600 to-teal-600 text-white':'bg-gray-100 text-gray-600'}`}>
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <button onClick={handleFoodScan} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-3">
                  <Camera className="w-6 h-6" />
                  Scan Food with AI
                </button>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)}
                    placeholder="Search food database..." 
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none" 
                  />
                </div>

                {searchQuery && (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredFoods.map((food,i)=>(
                      <button key={i} onClick={()=>addFoodFromDatabase(food)} className="w-full p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl text-left transition-all">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">{food.name}</p>
                            <p className="text-xs text-gray-500">{food.unit}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600">{food.calories} cal</p>
                            <p className="text-xs text-gray-500">P:{food.protein}g C:{food.carbs}g</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <button onClick={()=>setShowManualEntry(true)} className="w-full bg-white border-2 border-emerald-600 text-emerald-600 py-3 rounded-2xl font-semibold hover:bg-emerald-50 transition-all">
                  Add Manually
                </button>
              </div>
            </div>
          </div>
        )}

        {showManualEntry && (
          <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold">Manual Entry</h3>
                <button onClick={()=>{setShowManualEntry(false);setManualFoodData({name:'',calories:'',protein:'',carbs:'',fats:'',quantity:1,unit:'serving'});}} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Food Name *</label>
                  <input value={manualFoodData.name} onChange={(e)=>setManualFoodData({...manualFoodData,name:e.target.value})} placeholder="e.g., Homemade Pasta" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                    <input type="number" value={manualFoodData.quantity} onChange={(e)=>setManualFoodData({...manualFoodData,quantity:parseFloat(e.target.value)||1})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
                    <select value={manualFoodData.unit} onChange={(e)=>setManualFoodData({...manualFoodData,unit:e.target.value})} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none">
                      <option value="serving">serving</option>
                      <option value="gram">gram</option>
                      <option value="cup">cup</option>
                      <option value="piece">piece</option>
                      <option value="bowl">bowl</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Calories *</label>
                  <input type="number" value={manualFoodData.calories} onChange={(e)=>setManualFoodData({...manualFoodData,calories:e.target.value})} placeholder="e.g., 300" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
                    <input type="number" value={manualFoodData.protein} onChange={(e)=>setManualFoodData({...manualFoodData,protein:e.target.value})} placeholder="0" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
                    <input type="number" value={manualFoodData.carbs} onChange={(e)=>setManualFoodData({...manualFoodData,carbs:e.target.value})} placeholder="0" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fats (g)</label>
                    <input type="number" value={manualFoodData.fats} onChange={(e)=>setManualFoodData({...manualFoodData,fats:e.target.value})} placeholder="0" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none" />
                  </div>
                </div>

                <button onClick={addManualFood} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all">
                  Add to {selectedMealType}
                </button>
              </div>
            </div>
          </div>
        )}

        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-64 border-4 border-emerald-500 rounded-3xl mb-6 flex items-center justify-center">
                <Camera className="w-24 h-24 text-emerald-500 animate-pulse" />
              </div>
              <p className="text-white text-xl font-bold mb-2">AI Scanning...</p>
              <p className="text-gray-300">Analyzing nutrition</p>
            </div>
          </div>
        )}

        {showCoach && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-md mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-bold text-xl">Coach {userData.coachName}</h3>
                    <p className="text-xs text-purple-200">Always online</p>
                  </div>
                </div>
                <button onClick={()=>setShowCoach(false)} className="text-white hover:bg-white/20 p-2 rounded-xl">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="bg-purple-50 px-4 py-3 border-b">
              <div className="flex justify-around text-xs text-center">
                {[
                  {label:'Calories',value:`${todayStats.calories}/${userData.dailyCalorieGoal}`},
                  {label:'Protein',value:`${todayStats.protein}g`},
                  {label:'Steps',value:todayStats.steps}
                ].map((s,i)=>(
                  <div key={i}>
                    <p className="text-gray-600 font-medium">{s.label}</p>
                    <p className="font-bold text-purple-600">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {coachMessages.map(msg=>(
                <div key={msg.id} className={`flex ${msg.type==='user'?'justify-end':'justify-start'} items-end gap-2`}>
                  {msg.type==='ai' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="max-w-[75%]">
                    <div className={`px-5 py-3 rounded-2xl shadow-lg ${msg.type==='user'?'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-none':'bg-white text-gray-800 border rounded-bl-none'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 px-2 mt-1 block">{msg.time}</span>
                  </div>
                  {msg.type==='user' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start items-end gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white px-5 py-4 rounded-2xl shadow-lg">
                    <div className="flex gap-1">
                      {[0,1,2].map(i=>(
                        <div key={i} className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay:`${i*0.2}s`}}></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="px-4 py-2 bg-white border-t">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  {emoji:'💡',text:'Meal ideas',msg:'What should I eat?'},
                  {emoji:'📊',text:'Progress',msg:'How am I doing?'},
                  {emoji:'💪',text:'Motivate',msg:'I need motivation'}
                ].map((btn,i)=>(
                  <button key={i} onClick={()=>setCoachInput(btn.msg)} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold whitespace-nowrap hover:shadow-md border border-purple-200">
                    {btn.emoji} {btn.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border-t-2 shadow-xl">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={coachInput}
                    onChange={(e)=>setCoachInput(e.target.value)}
                    onKeyPress={(e)=>{
                      if(e.key==='Enter'&&!e.shiftKey){
                        e.preventDefault();
                        handleCoachMessage();
                      }
                    }}
                    placeholder="Message Coach Emma..."
                    rows="1"
                    className="w-full px-5 py-3 pr-12 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none resize-none"
                    style={{minHeight:'48px',maxHeight:'120px'}}
                  />
                  <button className="absolute right-3 bottom-3 text-gray-400">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleCoachMessage}
                  disabled={!coachInput.trim()||isTyping}
                  className={`p-3 rounded-2xl shadow-lg ${coachInput.trim()&&!isTyping?'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl':'bg-gray-100 text-gray-400'}`}
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutriSnap;
