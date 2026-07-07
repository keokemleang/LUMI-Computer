import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Clock, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: {
    slug: string;
    title: string;
    description: string;
    thumbnail: string;
    instructor: string;
    difficulty: string;
    duration: string;
    lessonsCount: number;
    price: number;
    rating: number;
    reviewCount: number;
  };
  className?: string;
}

const difficultyVariant: Record<string, "default" | "secondary" | "destructive"> = {
  Beginner: "default",
  Intermediate: "secondary",
  Advanced: "destructive",
};

export function CourseCard({ course, className }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md",
          className
        )}
      >
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 grid place-items-center bg-black/0 transition-colors group-hover:bg-black/20">
            <PlayCircle className="h-12 w-12 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
          </div>
          <Badge className="absolute right-2 top-2 bg-background/85 text-foreground backdrop-blur">
            {course.difficulty}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 font-semibold leading-tight group-hover:text-primary">
            {course.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">by {course.instructor}</p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <PlayCircle className="h-3.5 w-3.5" /> {course.lessonsCount} lessons
            </span>
          </div>
          <div className="mt-3">
            <StarRating rating={course.rating} showValue count={course.reviewCount} />
          </div>
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-lg font-bold">
              {course.price === 0 ? "Free" : `$${course.price.toFixed(2)}`}
            </span>
            <span className="text-sm font-medium text-primary">Enroll →</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
