import { Plus } from "../../../svg";
import styles from "./Stories.module.css";
import Card from "../../UI/Card/Card";
import { ScrollContainer } from "react-indiana-drag-scroll";
import { useNavigate } from "react-router-dom";

function Stories() {
  const navigate = useNavigate();

  const categories = [
    { 
      icon: "🤝", 
      title: "Social",
      gradient: "from-purple-500 via-pink-500 to-red-500"
    },
    { 
      icon: "💼", 
      title: "Business",
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    { 
      icon: "📚", 
      title: "Education",
      gradient: "from-yellow-500 via-orange-500 to-red-500"
    },
    { 
      icon: "🎭", 
      title: "Entertainment",
      gradient: "from-pink-500 via-rose-500 to-red-500"
    },
    { 
      icon: "🎮", 
      title: "Gaming",
      gradient: "from-indigo-500 via-purple-500 to-pink-500"
    },
    { 
      icon: "✨", 
      title: "Other",
      gradient: "from-green-500 via-emerald-500 to-teal-500"
    }
  ];

  return (
    <Card className={styles.wrap}>
      <ScrollContainer className={styles.scroll_container}>
        <div className={styles.categories}>
          <div className={styles.category_item}>
            <div 
              className={`${styles.story_ring} ${styles.create_ring}`}
              onClick={() => navigate("/create-event")}
            >
              <div className={styles.story_circle}>
                <div className={styles.plus_icon}>
                  <Plus color="#fff" />
                </div>
              </div>
            </div>
            <span className={styles.category_title}>Create</span>
          </div>

          {categories.map((category, i) => (
            <div 
              key={i} 
              className={styles.category_item}
              onClick={() => navigate(`/events/${category.title.toLowerCase()}`)}
            >
              <div className={`${styles.story_ring} bg-gradient-to-br ${category.gradient}`}>
                <div className={styles.story_circle}>
                  <span className={styles.category_icon}>{category.icon}</span>
                </div>
              </div>
              <span className={styles.category_title}>{category.title}</span>
            </div>
          ))}
        </div>
      </ScrollContainer>
    </Card>
  );
}

export default Stories;
