import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, CreditCard, Package, Truck, Calendar, CreditCard as CardIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: (orderId: string) => void;
  total: number;
}

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'emi', name: 'EMI', icon: Calendar },
  { id: 'cod', name: 'Cash on Delivery', icon: Package }
];

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total }) => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [currentStep, setCurrentStep] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [orderId, setOrderId] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const { user } = useAuth();

  const steps = [
    { icon: CreditCard, text: 'Processing Payment' },
    { icon: Package, text: 'Preparing Order' },
    { icon: Truck, text: 'Ready for Shipping' }
  ];

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('pending');
      setCurrentStep(0);
      // Generate a unique order ID with timestamp and random string to avoid duplicates
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      setOrderId(`ORD-${timestamp}-${randomStr}`);
    }
  }, [isOpen]);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast.error('Please fill in all payment details');
      return;
    }

    setPaymentStatus('processing');
    
    // Simulate payment processing
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          handlePaymentSuccess();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handlePaymentSuccess = async () => {
    setPaymentStatus('success');
    
    // Save order to user's profile if logged in
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const orderData = {
            id: orderId,
            date: new Date().toISOString(),
            total: total,
            status: 'Processing'
          };
          
          await updateDoc(userRef, {
            orders: arrayUnion(orderData)
          });
          
          toast.success('Order saved to your profile');
        }
      } catch (error) {
        console.error('Error saving order:', error);
      }
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => paymentStatus === 'success' && onClose(orderId)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6">
                {paymentStatus === 'success' && (
                  <button
                    onClick={() => onClose(orderId)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}

                <div className="text-center">
                  {paymentStatus === 'pending' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-4"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Payment Details
                      </h3>
                      
                      <form onSubmit={handleSubmitPayment} className="space-y-4">
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {paymentMethods.map((method) => {
                              const Icon = method.icon;
                              return (
                                <button
                                  key={method.id}
                                  type="button"
                                  onClick={() => setSelectedPaymentMethod(method.id)}
                                  className={`flex items-center justify-center p-3 rounded-lg border ${
                                    selectedPaymentMethod === method.id
                                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                                      : 'border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <Icon className="h-5 w-5 mr-2" />
                                  <span>{method.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {selectedPaymentMethod === 'emi' && (
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">EMI Options</label>
                            <div className="grid grid-cols-2 gap-3">
                              {emiOptions.map((option) => (
                                <button
                                  key={option.months}
                                  type="button"
                                  onClick={() => setSelectedEmiPeriod(option.months)}
                                  className={`p-3 text-center rounded-lg border ${
                                    selectedEmiPeriod === option.months
                                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                                      : 'border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="font-medium">{option.months} Months</div>
                                  <div className="text-sm text-gray-500">
                                    {option.interest === 0 ? 'No Interest' : `${option.interest}% Interest`}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedPaymentMethod === 'cod' && (
                          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                              Pay when your order is delivered. Additional charges may apply.
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                            Card Number
                          </label>
                          <div className="relative">
                            <CardIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                              Expiry Date
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                              <input
                                type="text"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                                placeholder="MM/YY"
                                maxLength={5}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                              placeholder="123"
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Shipping</span>
                            <span>Free</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition mt-4"
                        >
                          Pay Now
                        </motion.button>
                      </form>
                    </motion.div>
                  ) : paymentStatus === 'processing' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-8"
                    >
                      <div className="flex justify-center space-x-12 mb-8">
                        {steps.map((step, index) => {
                          const Icon = step.icon;
                          return (
                            <motion.div
                              key={index}
                              className={`flex flex-col items-center ${
                                index <= currentStep ? 'text-rose-500' : 'text-gray-300'
                              }`}
                              animate={index === currentStep ? {
                                scale: [1, 1.2, 1],
                                transition: { repeat: Infinity, duration: 1 }
                              } : {}}
                            >
                              <Icon className="h-8 w-8 mb-2" />
                              <motion.div
                                className="h-1 w-8 rounded-full"
                                style={{
                                  backgroundColor: index <= currentStep ? '#f43f5e' : '#e5e7eb'
                                }}
                                initial={{ scaleX: 0 }}
                                animate={index <= currentStep ? { scaleX: 1 } : {}}
                                transition={{ duration: 0.5 }}
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {steps[currentStep].text}
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Total amount: ₹{total.toFixed(2)}
                      </p>
                      <p className="mt-2 text-gray-600">
                        Order ID: {orderId}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          duration: 0.6
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 1,
                            ease: "easeInOut",
                          }}
                        >
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        </motion.div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="mt-4 text-2xl font-bold text-gray-900">
                          Order Confirmed!
                        </h3>
                        <p className="mt-2 text-gray-600">
                          Thank you for your purchase. Your order will be delivered soon.
                        </p>
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{orderId}</span></p>
                          <p className="text-sm text-gray-600 mt-1">Amount: <span className="font-medium">₹{total.toFixed(2)}</span></p>
                          <p className="text-sm text-gray-600 mt-1">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
                        </div>
                        <motion.button
                          onClick={() => onClose(orderId)}
                          className="mt-6 bg-rose-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-rose-600 transition"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Continue Shopping
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;