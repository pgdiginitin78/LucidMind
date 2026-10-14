import { cn } from "@/lib/utils";

export const Heading = ({ level = 2, children, className, ...props }) => {
  const Tag = `h${level}`;

  return (
    <Tag className={cn("font-playfair font-semibold", className)} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;
