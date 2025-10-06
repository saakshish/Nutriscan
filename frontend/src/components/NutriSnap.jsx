import React, { useState, useEffect } from 'react';
import { Camera, Home, TrendingUp, User, Plus, Search, Target, Flame, Droplet, Apple, Brain, ChevronRight, Calendar, Award, Bell, Settings, LogOut, X, Check, MessageSquare, Zap, CheckCircle, XCircle, Activity, Coffee, Moon, Sun } from 'lucide-react';

const NutriSnap = () => {
  const [currentView, setCurrentView] = useState('home');
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    weight: 75,
    targetWeight: 70,
    height: 175,
    age: 28,
    dailyCalorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatsGoal: 65,
    coachName: 'Emma'
  });
  
  const [todayStats, setTodayStats] = useState({
    calories: 1450,
    protein: 95,
    carbs: 145,
    fats: 48,
    water: 6,
    steps: 8542
  });

  const [meals, setMeals] = useState([
    { id: 1, name: 'Oatmeal with Berries', type: 'Breakfast', calories: 350, protein: 12, carbs: 58, fats: 8, time: '08:30 AM' },
    { id: 2, name: 'Grilled Chicken Salad', type: 'Lunch', calories: 450, protein: 45, carbs: 35, fats: 18, time: '01:00 PM' },
    { id: 3, name: 'Greek Yogurt & Nuts', type: 'Snack', calories: 280, protein: 18, carbs: 22, fats: 12, time: '04:30 PM' },
    { id: 4, name: 'Salmon with Quinoa', type: 'Dinner', calories: 370, protein: 20, carbs: 30, fats: 10, time: '07:45 PM' }
  ]);

  const [dailyChecklist, setDailyChecklist] = useState([
    { id: 1, task: 'Morning weigh-in', completed: true, time: '07:00 AM', icon: 'scale' },
    { id: 2, task: 'Log breakfast', completed: true, time: '08:30 AM', icon: 'breakfast' },
    { id: 3, task: 'Drink 8 glasses of water', completed: false, progress: 6, target: 8, icon: 'water' },
    { id: 4, task: 'Hit 10,000 steps', completed: false, progress: 8542, target: 10000, icon: 'steps' },
    { id: 5, task: 'Evening workout', completed: false, time: '06:00 PM', icon: 'workout' },
    { id: 6, task: 'Log dinner', completed: false, time: '07:30 PM', icon: 'dinner' }
  ]);

  const [coachMessages, setCoachMessages] = useState([
    { 
      id: 1, 
      type: 'greeting',
      message: "Good morning, Alex! 🌟 Ready to crush another day? Let's start with your daily check-in!",
      time: '07:00 AM',
      actions: ['Start Check-in', 'View Today\'s Plan']
    }
  ]);

  const [showAIChat, setShowAIChat] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInStep, setCheckInStep] = useState(0);
  const [checkInData, setCheckInData] = useState({
    mood: null,
    energy: null,
    sleep: null,
    hunger: null,
    stress: null
  });

  const [aiMessages, setAiMessages] = useState([
    { type: 'ai', text: 'Hello! I\'m your AI nutrition assistant. I can help you with meal planning, nutrition advice, and achieving your health goals. How can I help you today?' }
  ]);
  const [aiInput, setAiInput] = useState('');

  const [showAddMeal, setShowAddMeal] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const caloriePercentage = (todayStats.calories / userData.dailyCalorieGoal) * 100;
  const proteinPercentage = (todayStats.protein / userData.proteinGoal) * 100;
  const carbsPercentage = (todayStats.carbs / userData.carbsGoal) * 100;
  const fatsPercentage = (todayStats.fats / userData.fatsGoal) * 100;

  const checkInQuestions = [
    { 
      question: "How are you feeling today?",
      options: ['😊 Great', '😐 Okay', '😔 Not good', '😫 Tired'],
      key: 'mood',
      icon: '😊'
    },
    { 
      question: "How's your energy level?",
      options: ['⚡ High', '🔋 Medium', '🪫 Low', '😴 Exhausted'],
      key: 'energy',
      icon: '⚡'
    },
    { 
      question: "How did you sleep last night?",
      options: ['😴 Great (7-9h)', '😊 Good (6-7h)', '😐 Fair (5-6h)', '😫 Poor (<5h)'],
      key: 'sleep',
      icon: '🌙'
    },
    { 
      question: "What's your hunger level?",
      options: ['🍽️ Very hungry', '🍴 Hungry', '😊 Satisfied', '🤢 Too full'],
      key: 'hunger',
      icon: '🍽️'
    },
    { 
      question: "Stress level today?",
      options: ['😌 Calm', '😊 Manageable', '😰 Stressed', '😫 Very stressed'],
      key: 'stress',
      icon: '🧘'
    }
  ];

  const handleCheckInAnswer = (answer) => {
    const currentQuestion = checkInQuestions[checkInStep];
    setCheckInData({ ...checkInData, [currentQuestion.key]: answer });
    
    if (checkInStep < checkInQuestions.length - 1) {
      setCheckInStep(checkInStep + 1);
    } else {
      completeCheckIn();
    }
  };

  const completeCheckIn = () => {
    const newMessage = {
      id: Date.now(),
      type: 'insight',
      message: generateCoachInsight(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      actions: ['View Tasks', 'Get Meal Plan']
    };
    setCoachMessages([...coachMessages, newMessage]);
    setShowCheckIn(false);
    setCheckInStep(0);
    setShowCoach(true);
  };

  const generateCoachInsight = () => {
    const insights = [];
    
    if (checkInData.energy && checkInData.energy.includes('Low')) {
      insights.push("Your energy is low. I recommend a protein-rich snack and staying hydrated.");
    }
    if (checkInData.sleep && checkInData.sleep.includes('Poor')) {
      insights.push("Sleep is crucial! Try to get 7-8 hours tonight. Consider an earlier dinner.");
    }
    if (checkInData.stress && checkInData.stress.includes('stressed')) {
      insights.push("Stress can affect your goals. Try a 10-minute walk or meditation today.");
    }
    if (checkInData.hunger && checkInData.hunger.includes('Very hungry')) {
      insights.push("You're very hungry! Let's plan your meals to maintain steady energy.");
    }
    
    if (insights.length === 0) {
      return "Great check-in! You're doing well. Stay consistent with your meal plan and you'll reach your goals! 💪";
    }
    
    return insights.join(' ') + " I'm here to support you every step! 💚";
  };

  const toggleChecklistItem = (id) => {
    setDailyChecklist(dailyChecklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    
    const completedCount = dailyChecklist.filter(item => item.completed).length;
    if (completedCount === dailyChecklist.length - 1) {
      const celebrationMessage = {
        id: Date.now(),
        type: 'celebration',
        message: "🎉 Amazing work! You've completed almost all your tasks today. You're unstoppable! Keep it up!",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setCoachMessages([...coachMessages, celebrationMessage]);
    }
  };

  const handleAIMessage = () => {
    if (!aiInput.trim()) return;
    
    const newMessages = [...aiMessages, { type: 'user', text: aiInput }];
    setAiMessages(newMessages);
    
    setTimeout(() => {
      let response = '';
      const input = aiInput.toLowerCase();
      
      if (input.includes('meal') || input.includes('plan')) {
        response = 'Based on your goals, I recommend: Breakfast - Protein smoothie with banana (320 cal), Lunch - Quinoa bowl with vegetables (480 cal), Snack - Almonds & apple (210 cal), Dinner - Grilled fish with sweet potato (520 cal). This keeps you within your 2000 calorie target while meeting macro goals!';
      } else if (input.includes('protein') || input.includes('workout')) {
        response = `You're at ${todayStats.protein}g of your ${userData.proteinGoal}g protein goal. Great job! Consider adding: grilled chicken breast (31g), Greek yogurt (17g), or a protein shake (25g) to reach your target.`;
      } else if (input.includes('weight') || input.includes('lose')) {
        response = `You're ${userData.weight - userData.targetWeight}kg away from your goal! At your current pace with a 500 calorie deficit, you could reach ${userData.targetWeight}kg in about 10 weeks. Stay consistent with your nutrition and exercise!`;
      } else if (input.includes('water') || input.includes('hydration')) {
        response = `You've had ${todayStats.water} glasses today. Aim for 8-10 glasses daily. Proper hydration boosts metabolism and helps with appetite control. Set reminders every 2 hours!`;
      } else if (input.includes('coach') || input.includes('checkin')) {
        response = 'Your AI coach Emma is available 24/7! She provides daily check-ins, personalized insights, task management, and motivation. Tap the coach icon to see your daily tasks and get personalized guidance!';
      } else {
        response = 'I can help you with meal planning, nutrition tracking, workout suggestions, and personalized health advice. What specific aspect would you like guidance on?';
      }
      
      setAiMessages([...newMessages, { type: 'ai', text: response }]);
    }, 1000);
    
    setAiInput('');
  };

  const handleFoodScan = () => {
    setShowCamera(true);
    setTimeout(() => {
      const scannedFood = {
        id: Date.now(),
        name: 'Grilled Chicken Breast',
        type: 'Scanned',
        calories: 165,
        protein: 31,
        carbs: 0,
        fats: 4,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMeals([...meals, scannedFood]);
      setTodayStats({
        ...todayStats,
        calories: todayStats.calories + 165,
        protein: todayStats.protein + 31,
        fats: todayStats.fats + 4
      });
      setShowCamera(false);
      setShowAddMeal(false);
      
      const coachResponse = {
        id: Date.now(),
        type: 'feedback',
        message: `Great choice! The grilled chicken adds 31g of protein. You're now at ${todayStats.protein + 31}g protein - only ${userData.proteinGoal - (todayStats.protein + 31)}g away from your daily goal! 🎯`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setCoachMessages([...coachMessages, coachResponse]);
    }, 2000);
  };

  const CoachView = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Coach {userData.coachName}</h2>
            <p className="text-purple-100">Your AI Wellness Guide</p>
          </div>
        </div>
        
        {!dailyChecklist.some(item => item.task === 'Morning weigh-in' && item.completed) && (
          <button
            onClick={() => setShowCheckIn(true)}
            className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Complete Daily Check-in
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
          Today's Tasks
        </h3>
        <div className="space-y-3">
          {dailyChecklist.map(item => (
            <div 
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                item.completed ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.completed 
                      ? 'bg-emerald-600 border-emerald-600' 
                      : 'border-gray-300 hover:border-emerald-600'
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${item.completed ? 'text-emerald-700 line-through' : 'text-gray-800'}`}>
                    {item.task}
                  </p>
                  {item.progress && (
                    <div className="mt-1">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{item.progress.toLocaleString()}</span>
                        <span>{item.target.toLocaleString()}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min((item.progress / item.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {item.time && <p className="text-xs text-gray-500 mt-1">{item.time}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
          Coach Messages
        </h3>
        <div className="space-y-3">
          {coachMessages.map(msg => (
            <div key={msg.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <p className="text-gray-800 mb-2">{msg.message}</p>
              <p className="text-xs text-gray-500">{msg.time}</p>
              {msg.actions && (
                <div className="flex gap-2 mt-3">
                  {msg.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => action === 'Start Check-in' && setShowCheckIn(true)}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-5 border-2 border-orange-200">
        <h3 className="text-lg font-bold mb-2 flex items-center text-orange-800">
          <Zap className="w-5 h-5 mr-2" />
          Quick Tips for Today
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">•</span>
            <span>Drink a glass of water before each meal to aid digestion</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">•</span>
            <span>Take a 10-minute walk after lunch to boost metabolism</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 mt-1">•</span>
            <span>Prep tomorrow's breakfast tonight to save time</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const HomePage = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Hello, {userData.name.split(' ')[0]}! 👋</h2>
            <p className="text-emerald-100">Let's crush your goals today</p>
          </div>
          <button onClick={() => setShowCoach(true)} className="relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Daily Calorie Goal</span>
            <span className="text-lg font-bold">{todayStats.calories} / {userData.dailyCalorieGoal}</span>
          </div>
          <div className="bg-white/30 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Daily Progress
          </h3>
          <button 
            onClick={() => setCurrentView('coach')}
            className="text-sm text-purple-600 font-semibold hover:text-purple-700"
          >
            View All Tasks
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {dailyChecklist.slice(0, 4).map(item => (
            <div 
              key={item.id}
              className={`p-3 rounded-lg ${item.completed ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">{item.task}</span>
                {item.completed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-600">{todayStats.calories}</span>
          </div>
          <p className="text-sm text-gray-600">Calories</p>
          <div className="mt-2 text-xs text-orange-600 font-medium">
            {userData.dailyCalorieGoal - todayStats.calories} left
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Droplet className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">{todayStats.water}</span>
          </div>
          <p className="text-sm text-gray-600">Glasses of Water</p>
          <div className="mt-2 text-xs text-blue-600 font-medium">
            {8 - todayStats.water} more to go
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Apple className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-600">{todayStats.protein}g</span>
          </div>
          <p className="text-sm text-gray-600">Protein</p>
          <div className="mt-2 text-xs text-purple-600 font-medium">
            {Math.round(proteinPercentage)}% of goal
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-600">{todayStats.steps}</span>
          </div>
          <p className="text-sm text-gray-600">Steps Today</p>
          <div className="mt-2 text-xs text-green-600 font-medium">
            85% of 10,000 goal
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
          Today's Meals
        </h3>
        <div className="space-y-3">
          {meals.map(meal => (
            <div key={meal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{meal.name}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">{meal.type}</span>
                  <span className="text-xs text-gray-400">{meal.time}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-600">{meal.calories} cal</div>
                <div className="text-xs text-gray-500">P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g</div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowAddMeal(true)}
          className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Meal
        </button>
      </div>

      <button
        onClick={() => setShowAIChat(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );

  const ProgressPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Progress</h2>
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Weight Journey</h3>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-blue-100">Current</p>
            <p className="text-3xl font-bold">{userData.weight} kg</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-100">Lost</p>
            <p className="text-2xl font-bold">5 kg</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Target</p>
            <p className="text-3xl font-bold">{userData.targetWeight} kg</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-full h-3">
          <div className="bg-white h-full rounded-full" style={{ width: '67%' }} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Macro Distribution</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Protein</span>
              <span className="text-sm font-bold text-purple-600">{todayStats.protein}g / {userData.proteinGoal}g</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${Math.min(proteinPercentage, 100)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Carbs</span>
              <span className="text-sm font-bold text-blue-600">{todayStats.carbs}g / {userData.carbsGoal}g</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(carbsPercentage, 100)}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Fats</span>
              <span className="text-sm font-bold text-orange-600">{todayStats.fats}g / {userData.fatsGoal}g</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <div className="bg-orange-600 h-full rounded-full" style={{ width: `${Math.min(fatsPercentage, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
          <Award className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-700">15</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
          <Target className="w-8 h-8 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-yellow-700">89%</p>
          <p className="text-sm text-gray-600">Goal Achievement</p>
        </div>
      </div>
    </div>
  );

  const ProfilePage = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">{userData.name}</h2>
        <p className="text-emerald-100">Member since Jan 2025</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Personal Info</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Age</span>
            <span className="font-semibold">{userData.age} years</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Height</span>
            <span className="font-semibold">{userData.height} cm</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Current Weight</span>
            <span className="font-semibold">{userData.weight} kg</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Target Weight</span>
            <span className="font-semibold">{userData.targetWeight} kg</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Settings</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-5 border-t border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Logout</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative pb-20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                NutriSnap
              </h1>
            </div>
            <Bell className="w-6 h-6 text-gray-600" />
          </div>

          {currentView === 'home' && <HomePage />}
          {currentView === 'coach' && <CoachView />}
          {currentView === 'progress' && <ProgressPage />}
          {currentView === 'profile' && <ProfilePage />}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto flex justify-around items-center py-3 px-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentView === 'home' ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            <button
              onClick={() => setCurrentView('coach')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${
                currentView === 'coach' ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <Brain className="w-6 h-6" />
              <span className="text-xs font-medium">Coach</span>
              {coachMessages.length > 1 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {coachMessages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowAddMeal(true)}
              className="flex flex-col items-center gap-1 p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full -mt-8 shadow-lg"
            >
              <Camera className="w-7 h-7 text-white" />
            </button>

            <button
              onClick={() => setCurrentView('progress')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentView === 'progress' ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progress</span>
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentView === 'profile' ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>

        {showCheckIn && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                  {checkInQuestions[checkInStep].icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{checkInQuestions[checkInStep].question}</h3>
                <div className="flex justify-center gap-2 mt-4">
                  {checkInQuestions.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === checkInStep ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                {checkInQuestions[checkInStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCheckInAnswer(option)}
                    className="w-full p-4 bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-500 rounded-xl font-medium text-left transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  setShowCheckIn(false);
                  setCheckInStep(0);
                }}
                className="w-full mt-4 py-3 text-gray-500 hover:text-gray-700 font-medium"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {showAddMeal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 max-w-md mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Meal</h3>
                <button onClick={() => setShowAddMeal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleFoodScan}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Camera className="w-5 h-5" />
                  Scan Food with AI
                </button>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search food database..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                
                <div className="text-center text-sm text-gray-500 py-4">
                  Or manually enter meal details
                </div>
              </div>
            </div>
          </div>
        )}

        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-64 border-4 border-emerald-500 rounded-2xl mb-4 mx-auto flex items-center justify-center">
                <Camera className="w-20 h-20 text-emerald-500 animate-pulse" />
              </div>
              <p className="text-white text-lg font-semibold">AI Scanning Food...</p>
              <p className="text-gray-300 text-sm mt-2">Analyzing nutritional content</p>
            </div>
          </div>
        )}

        {showAIChat && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-md mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">AI Nutrition Assistant</h3>
                  <p className="text-xs text-blue-100">Always here to help</p>
                </div>
              </div>
              <button onClick={() => setShowAIChat(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIMessage()}
                  placeholder="Ask me anything about nutrition..."
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleAIMessage}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-full hover:shadow-lg transition-all"
                >
                  <Check className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {showCoach && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 max-w-md mx-auto max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Coach Messages</h3>
                <button onClick={() => setShowCoach(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3">
                {coachMessages.map(msg => (
                  <div key={msg.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-gray-800 mb-2">{msg.message}</p>
                    <p className="text-xs text-gray-500">{msg.time}</p>
                    {msg.actions && (
                      <div className="flex gap-2 mt-3">
                        {msg.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (action === 'Start Check-in') {
                                setShowCoach(false);
                                setShowCheckIn(true);
                              }
                            }}
                            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutriSnap;