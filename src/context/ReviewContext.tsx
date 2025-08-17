import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Review } from "../types";

interface ReviewState {
  reviews: { [productId: string]: Review[] };
  averageRatings: { [productId: string]: number };
}

type ReviewAction =
  | { type: "ADD_REVIEW"; payload: { productId: string; review: Review } }
  | { type: "UPDATE_REVIEW"; payload: { productId: string; review: Review } }
  | { type: "DELETE_REVIEW"; payload: { productId: string; reviewId: string } }
  | { type: "SET_REVIEWS"; payload: { productId: string; reviews: Review[] } };

const ReviewContext = createContext<{
  state: ReviewState;
  dispatch: React.Dispatch<ReviewAction>;
} | null>(null);

const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

const reviewReducer = (
  state: ReviewState,
  action: ReviewAction
): ReviewState => {
  switch (action.type) {
    case "ADD_REVIEW": {
      const productReviews = [
        ...(state.reviews[action.payload.productId] || []),
        action.payload.review,
      ];
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.productId]: productReviews,
        },
        averageRatings: {
          ...state.averageRatings,
          [action.payload.productId]: calculateAverageRating(productReviews),
        },
      };
    }
    case "UPDATE_REVIEW": {
      const productReviews = (
        state.reviews[action.payload.productId] || []
      ).map((review) =>
        review.id === action.payload.review.id ? action.payload.review : review
      );
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.productId]: productReviews,
        },
        averageRatings: {
          ...state.averageRatings,
          [action.payload.productId]: calculateAverageRating(productReviews),
        },
      };
    }
    case "DELETE_REVIEW": {
      const productReviews = (
        state.reviews[action.payload.productId] || []
      ).filter((review) => review.id !== action.payload.reviewId);
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.productId]: productReviews,
        },
        averageRatings: {
          ...state.averageRatings,
          [action.payload.productId]: calculateAverageRating(productReviews),
        },
      };
    }
    case "SET_REVIEWS": {
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.productId]: action.payload.reviews,
        },
        averageRatings: {
          ...state.averageRatings,
          [action.payload.productId]: calculateAverageRating(
            action.payload.reviews
          ),
        },
      };
    }
    default:
      return state;
  }
};

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reviewReducer, {
    reviews: {},
    averageRatings: {},
  });

  return (
    <ReviewContext.Provider value={{ state, dispatch }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
};
