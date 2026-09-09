# 央国企Java核心八股

这篇文章用于央国企 Java 后端方向的技术复习，重点不是把所有知识点铺满，而是把高频八股压缩成一套可以复述、可以追问、可以和项目经历连接起来的准备框架。

央国企 Java 面试通常不会只考某一个孤立概念，而是围绕“基础语法、集合容器、并发编程、Spring 体系、数据库、中间件、计算机基础”几条主线展开。复习时建议先掌握每个模块的核心机制，再补充典型应用场景和常见失败点。这样回答时不只是背定义，也能说明为什么这样设计、项目里如何使用、出问题时如何排查。

本文适合按三层来使用：

- **基础盘**：Java 基础、集合、异常、JVM 基本概念、MySQL 事务和索引。
- **核心盘**：并发、线程池、锁、Spring Boot、Redis 缓存问题、MySQL 日志和锁。
- **加分盘**：结合项目讲清缓存一致性、线程池参数、数据库索引设计、接口性能优化和线上问题排查。

# 央国企核心精简版Java八股脑图

![images/board-En5JwShGghHaTYbzSa7cCiBdnsf.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/c0ae949b06284bc596b2a4ce7ef129fb.png)

images/board-En5JwShGghHaTYbzSa7cCiBdnsf.png

# Java基础

## Java语法

### Java和C++的区别？
| 维度 | Java | C++ |
| --- | --- | --- |
| 内存管理 | 自动垃圾回收（GC） | 手动管理（new/delete）或智能指针 |
| 跨平台 | 依赖JVM（一次编写，到处运行） | 需为不同平台单独编译，Linux、Windows |
| 性能 | 有 JVM 开销，适合大多数场景 | 直接编译为机器码，性能更高 |
| 语法 | 纯面向对象，单继承 | 支持多范式，多继承 |
| 应用场景 | 企业级开发、Android、大数据 | 系统软件、游戏、嵌入式系统 |
| 安全性 | 严格检查（如数组越界） | 需手动规避指针风险 |

### 成员变量和局部变量区别？

- 示例代码

class A{ 
int a = 0; //成员变量 
static int staticA = 0; //静态成员变量 
 
public void fun(int f){ 
int b = 1; //局部变量 
int c= a + b; 
} 
 
public static void main(){ 
A objA = new A(); 
objA.fun(3); 
} 
 
}

- 示例图 
 
 ![images/board-YRgQwI9cihURxrbxCMrcDEROnUb.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/2f90e242d65a4af48cac3b53c63b6048.png)

Java 中的成员变量和局部变量在定义位置、作用域、生命周期和默认值等方面存在显著差异。可以从定义位置、作用域、生命周期和默认值几个维度区分。
| 维度 | 成员变量（实例变量/类变量） | 局部变量 |
| --- | --- | --- |
| 定义位置 | 类中，方法、构造器或代码块外部 | 方法、构造器、代码块或参数列表中 |
| 作用域 | 整个类，可被类中所有方法访问 | 仅限于定义它的方法、构造器或代码块 |
| 生命周期 | 实例变量随对象创建而存在，随对象销毁而消失 类变量（static）随类加载而存在，随类卸载而消失 | 方法/代码块执行时创建，执行结束后销毁 |
| 默认值 | 有默认值（如 int 为 0，对象为 null） | 没有默认值，必须显式初始化后使用 |
| 修饰符 | 可使用 public、private、static 等修饰 | 一般不使用访问修饰符（如 public） |

- **示例代码**

public class VariableDemo { 
// 成员变量（实例变量） 
private int instanceVar; // 无初始值，默认0 
private String instanceStr; // 默认null 
 
// 成员变量（类变量，static） 
public static double classVar = 10.5; // 有初始值 
 
// 方法 func 
public void func(int param) { 
// param 是局部变量（构造器参数） 
int localVar=0; 
} 
 
}

### Java几种基本数据类型？

![images/board-CnSiwAoDVh1FkObDONgcFz8anjd.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/63dd500481a44649967cecb53e2a249b.png)

images/board-CnSiwAoDVh1FkObDONgcFz8anjd.png

#### 基本类型

基本类型直接存储值，并且是内置的语言类型。Java 的基本类型有以下几种：

- **整型**
 
 - byte：8位有符号整数，范围从-128到127。
 - short：16位有符号整数，范围从-32768到32767。
 - int：32位有符号整数，范围从-231到231-1。
 - long：64位有符号整数，范围从-263到263-1。使用L或l作为后缀。
 
- **浮点类型**
 
 - float：单精度32位IEEE 754浮点数。
 - double：双精度64位IEEE 754浮点数，默认的浮点数类型。
 
- **字符类型**
 
 - char：16位Unicode字符。
 
- **布尔类型**
 
 - boolean：只有两个可能的值，true和false。 #### 引用类型

![images/board-XwqLwfKLXh2MXQbLHoBcBVdNnoh.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/601275df12524e3fac595587edb959ba.png)

images/board-XwqLwfKLXh2MXQbLHoBcBVdNnoh.png

引用类型不是直接存储值，而是存储对对象的引用。这些类型包括：

- **类（Class）**：用户定义的对象类型。
- **接口（Interface）**：定义了一组行为规范，没有实现细节。
- **数组（Array）**：存储固定大小的同类型元素的有序集合。
- **枚举（Enum）**：一种特殊的类，用来枚举一组常量。 ### 什么是⾃动装箱和⾃动拆箱？

![images/board-R1X4wE2kshmAmvbpapOcpu44nbc.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/37a5b407d8e6412493903d7ee8843de3.png)

images/board-R1X4wE2kshmAmvbpapOcpu44nbc.png

自动装箱（Auto-boxing）和自动拆箱（Auto-unboxing）是Java 5引入的特性，它们简化了基本数据类型和其对应的包装类之间的转换。

#### （1）自动装箱（Auto-boxing）

自动装箱是指将基本数据类型自动转换为其对应的包装类对象的过程。这使得你可以直接将一个基本数据类型赋值给一个包装类类型的变量，而无需显式地使用包装类的构造函数或valueOf方法。例如：

int a = 10; 
Integer b = a; // 自动装箱

在这个例子中，a 是一个 int 类型的变量，将其赋值给 Integer 类型的变量 b 时，Java 会自动调用 Integer.valueOf(a) 方法来创建一个 Integer 对象。

#### （2）自动拆箱（Auto-unboxing）

自动拆箱则是相反的过程，即将包装类对象转换为基本数据类型。当你有一个包装类对象并且需要将其值作为一个基本类型使用时，自动拆箱会自动发生。例如：

Integer b = 10; // 自动装箱 
int a = b; // 自动拆箱

在这个例子中，b 是一个 Integer 对象，当将其赋值给 int 类型的变量 a 时，Java 会自动调用 b.intValue() 方法来获取基本类型 int 的值。

#### （3）性能考虑

虽然自动装箱和自动拆箱让代码更加简洁，但在性能方面需要注意。包装类对象是在堆上分配的，因此频繁地创建包装类对象可能会导致更多的垃圾收集活动。对于大量的数据处理，应尽量使用基本数据类型以提高性能。此外，由于自动装箱创建的是对象，所以当涉及到 null 值时，包装类对象可以为 null，而基本类型则不能。自动装箱和自动拆箱使得Java 编程更加便捷，但在性能敏感的应用中需要谨慎使用。

### Java 中值传递和引用传递区别？

![images/board-WnaBwogoGhQd7ubY1PncqKqSnWe.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/72100a7d744847e0be61811b81f69077.png)

images/board-WnaBwogoGhQd7ubY1PncqKqSnWe.png

在 Java 中，方法参数的传递实际上总是值传递（pass-by-value），而不是引用传递（pass-by-reference）。这是因为 Java 中的方法参数总是接收实际参数的一个副本。具体来说，对于基本类型，传递的是值的副本；对于对象，传递的是引用的副本。可以从基本类型和对象类型两个角度理解。

#### （1）基本类型（值传递）

当我们将基本类型（如 int、float、char 等）作为参数传递给方法时，实际上是传递了这些值的副本，这意味着在方法内部对参数的任何更改都不会影响到原始值。

public class ValuePassExample { 
public static void main(String\[\] args) { 
int x = 10; 
changeValue(x); 
System.out.println("x 的值是: " + x); // 输出 "x 的值是: 10" 
} 
 
public static void changeValue(int y) { 
y = 20; 
System.out.println("方法内部 y 的值是: " + y); // 输出 "方法内部 y 的值是: 20" 
} 
}

在这个示例中，changeValue 方法尝试修改传入的 int 类型参数 y 的值。但是，由于传递的是 x 的副本，所以在方法内部对 y 的修改不会影响到 main 方法中的 x 的值。

#### （2）对象（引用传递）

当我们传递对象作为参数时，实际上是传递了对象引用的副本,这意味着在方法内部可以修改对象的状态，但不能改变对象本身的引用。

public class ReferencePassExample { 
public static void main(String\[\] args) { 
MyClass obj = new MyClass(10); 
changeObject(obj); 
System.out.println("obj 的值是: " + obj.getValue()); // 输出 "obj 的值是: 20" 
} 
 
public static void changeObject(MyClass obj) { 
obj.setValue(20); 
System.out.println("方法内部 obj 的值是: " + obj.getValue()); // 输出 "方法内部 obj 的值是: 20" 
} 
}

在这个示例中，changeObject 方法接收一个 MyClass 类型的对象引用。虽然传递的是引用的副本，但是我们可以通过这个副本引用修改对象的状态（即 value 的值）。因此，当 changeObject 方法修改了对象的状态后，main 方法中的对象 obj 也会反映出这种变化。

#### （3）总结

- **基本类型**：传递的是值的副本，因此在方法内部对参数的修改不会影响到原始值。
- **对象**：传递的是引用的副本，因此在方法内部可以修改对象的状态，但不能改变对象本身的引用。 需要注意的是，在 Java 中，对象本身并不是被传递的，而是传递了指向对象的引用。因此，如果你试图在方法内部重新为参数引用赋值一个新的对象，那么这个新的对象不会影响到原来的对象。修改引用示例：

public class ChangeReferenceExample { 
public static void main(String\[\] args) { 
MyClass obj = new MyClass(10); 
changeReference(obj); 
System.out.println("obj 的值是: " + obj.getValue()); // 输出 "obj 的值是: 10" 
} 
 
public static void changeReference(MyClass obj) { 
obj = new MyClass(20); // 改变局部变量 obj 的引用，不影响外部的 obj 
System.out.println("方法内部 obj 的值是: " + obj.getValue()); // 输出 "方法内部 obj 的值是: 20" 
} 
} 
 
class MyClass { 
private int value; 
 
public MyClass(int value) { 
this.value = value; 
} 
 
public int getValue() { 
return value; 
} 
}

在这个示例中，尽管 changeReference 方法内部改变了 obj 的引用，但这并没有影响到 main 方法中的 obj 的值，因为它只是改变了方法内部的局部变量 obj 的引用。

### 深拷贝和浅拷贝区别？

![images/board-RBPXwS9dPhPdavb6rZac3P1Tnvc.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/05936e3dabe942ac9d4555d0dc65cbc3.png)

images/board-RBPXwS9dPhPdavb6rZac3P1Tnvc.png

#### （1）**浅拷贝（Shallow Copy）**

浅拷贝是指创建一个新的对象，并将原对象的引用类型成员变量直接赋值给新对象。这意味着新对象的引用类型成员变量仍然指向原对象的成员变量所指向的对象。因此，对新对象的引用类型成员变量所做的任何改变都会影响到原对象。

#### （2）**深拷贝（Deep Copy）**

深拷贝是指创建一个新的对象，并且递归地复制原对象的所有成员变量（包括引用类型成员变量）。这意味着新对象的引用类型成员变量指向的是原对象成员变量所指向对象的一个全新的拷贝。因此，对新对象的引用类型成员变量所做的任何改变都不会影响到原对象。

#### （3）**浅拷贝示例**

import java.util.Arrays; 
 
class ShallowCopyExample { 
public static void main(String\[\] args) { 
// 创建原始对象 
MyClass original = new MyClass(new int\[\]{1, 2, 3}); 
 
// 浅拷贝 
MyClass shallowCopy = original; 
 
// 修改拷贝对象 
shallowCopy.array\[0\] = 100; 
 
System.out.println("Original: " + Arrays.toString(original.array)); 
System.out.println("Shallow copy: " + Arrays.toString(shallowCopy.array)); 
} 
} 
 
class MyClass { 
int\[\] array; 
 
public MyClass(int\[\] array) { 
this.array = array; 
} 
}

#### （4）**深拷贝示例**

import java.util.Arrays; 
 
class DeepCopyExample { 
public static void main(String\[\] args) { 
// 创建原始对象 
MyClass original = new MyClass(new int\[\]{1, 2, 3}); 
 
// 深拷贝 
MyClass deepCopy = new MyClass(Arrays.copyOf(original.array, original.array.length)); 
 
// 修改拷贝对象 
deepCopy.array\[0\] = 100; 
 
System.out.println("Original: " + Arrays.toString(original.array)); 
System.out.println("Deep copy: " + Arrays.toString(deepCopy.array)); 
} 
} 
 
class MyClass { 
int\[\] array; 
 
public MyClass(int\[\] array) { 
this.array = array; 
} 
}

通过以上示例可以看出，浅拷贝只是简单地复制了对象的引用，而深拷贝则是创建了一个完全独立的新对象。

## Java对象

### \== 和 equals() 区别

class A{ 
int value = 0; 
} 
 
class B{ 
int value = 1; 
} 
 
void main(){ 
A objA = new A(); 
B objB = new B(); 
if(objA == objB){ 
//比对的内存地址 
} 
 
if(objA.equal(objB)){ 
//对比内容 
} 
 
}

\== 和 equals() 都是用来比较两个对象之间的相等性，但它们有不同的用途和行为：

- \==：这是一个运算符，用于比较两个对象的引用是否指向同一个**内存地址**。换句话说，== 检查的是两个对象是否是同一个对象。对于基本类型，== 比较的是它们的值是否相等。
- equals()：这是一个方法，定义在 Object 类中，用于比较两个对象的内容是否相等。默认情况下，Object 类中的 equals() 方法实际上也是使用 == 运算符来比较对象的引用。但是，很多类（如 String、Integer 等）会重写 equals() 方法，使其能够比较对象的内容而不是引用。 ### hashCode() 和 equals() 关系？

hashCode() 和 equals() 方法在 Java 中紧密相关，尤其是在实现自定义类时。这两者的关系如下：

- 当两个对象通过 equals() 方法判断为相等时，它们的 hashCode() 值必须相同。这是 hashCode() 方法的一个重要约定。
- 反过来，如果两个对象的 hashCode() 值相同，它们不一定相等。hashCode() 的值相同仅仅意味着这两个对象可能是相等的，但还需要通过 equals() 方法来最终确认。 ### 为什么要重写 hashCode 和 equals？

重写 hashCode() 和 equals() 方法的原因主要有以下几点：

- **一致性**：确保 equals() 方法返回 true 的两个对象具有相同的 hashCode() 值，这是 hashCode() 方法的合同之一。
- **容器性能**：当对象被用作哈希表（如 HashMap 或 HashSet）的键时，正确的 hashCode() 方法可以提高容器的性能。如果 hashCode() 方法没有正确实现，可能会导致哈希冲突增加，从而降低性能。
- **对象比较**：重写 equals() 方法可以让类按照自定义的规则来比较对象是否相等，这对于业务逻辑非常重要。 ## String

String 在 Java 中是一个不可变的类，它用于表示文本字符串。String 对象一旦创建，其内容就不能被改变。String 类本身是最终类（final），因此不能被继承。

### String存储原理

#### （1）String底层使用什么类型？

String 类底层使用byte\[\]（Java 9及以上）或char\[\]（Java 9以前）来存储字符串数据。这是因为字符串本质上是一系列字符的集合，而字符可以用char类型表示。在Java 9及以后版本中，使用byte\[\]加上coder数组的方式可以更好地支持Unicode编码。

#### （2）String/StringBuffer区别

![images/board-GjZqwJe46hPNf4bVbivc8NRdnde.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/1a238190af73457195638c1f90a1e8a4.png)

images/board-GjZqwJe46hPNf4bVbivc8NRdnde.png

String和StringBuffer的主要区别在于可变性：

- **String**是不可变的，一旦创建就不能修改其内容。每次对String 对象的修改都会创建一个新的String 对象。
- **StringBuffer**是可变的，可以对其内容进行修改而不创建新的对象。StringBuffer 类提供了许多方法来修改字符串，如append()、insert()、delete()等。
- StringAppender 另外，StringBuffer 方法是线程安全的(synchronized)，这意味着它可以在多线程环境下安全地使用，而String 对象本身由于不可变性天然就是线程安全的。

### 什么是字符串常量池？

字符串常量池是一个特殊的缓存机制，用于存储字符串字面量（literal）。当使用字符串字面量创建字符串时（如String a = "hello";），JVM 会在字符串常量池中查找是否存在相同的字符串，如果存在则返回池中的引用，否则会在池中创建一个新的字符串对象并返回其引用。这种机制有助于节省内存并提高性能，特别是在多次创建相同字符串的情况下。

### new String(“ABC”)和String a=“abc”区别?

![images/board-YtImwb2ELhNW8XbZeNicYoVhnld.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/02e7b03de17e45ee9025320c54a61ea7.png)

images/board-YtImwb2ELhNW8XbZeNicYoVhnld.png

- **new String(“ABC”)**：这种方式通过new关键字创建了一个新的String 对象，即使字符串常量池中已经存在相同的字符串，也会在堆上创建一个新的对象。这意味着每次使用这种方式创建字符串时都会生成一个新的对象。
- **String a=“abc”**：这种方式通过字符串字面量来创建字符串。JVM 会在字符串常量池中查找是否存在相同的字符串，如果存在，则直接返回池中的引用；如果不存在，则在池中创建一个新的字符串对象并返回其引用。这种方式不会创建额外的对象，除非字符串常量池中没有相同的字符串。 通过上述描述可以看出，String 类的设计旨在提供高效、安全的字符串操作，而StringBuffer则提供了一个可变的字符串解决方案，适用于需要频繁修改字符串内容的场景。字符串常量池机制则有助于优化内存使用，避免重复创建相同的字符串对象。

## 异常

### Error 和 Exception 区别

- **Error**：Error 类及其子类表示程序通常无法处理的严重错误，例如 JVM 自身问题、资源耗尽等。常见的 Error 包括 OutOfMemoryError、StackOverflowError 等，一般不建议在业务代码中捕获。
- **Exception**：Exception 类及其子类表示程序可以处理的异常情况，通常可以通过编程手段预防或恢复。Exception 可以进一步分为受检异常（Checked Exception）和非受检异常（Unchecked Exception）。 ### 受检异常和非受检异常
- **受检异常（Checked Exception）**：这些异常必须在编译时处理。如果方法可能抛出受检异常，那么要么在方法中捕获并处理它，要么在方法签名中声明该异常，以便调用者知道可能发生的异常。典型的受检异常包括IOException、SQLException等。
- **非受检异常（Unchecked Exception）**：这些异常在编译时不需要特别处理。它们通常是由于程序逻辑错误引起的，如NullPointerException、ArrayIndexOutOfBoundsException等。非受检异常继承自RuntimeException类。 ### Java异常处理机制

Java异常处理机制主要包括以下几个组成部分：

- try 块：包含可能抛出异常的代码段。
- catch 块：处理try 块中抛出的异常。一个try 块可以跟随一个或多个catch 块，每个catch 块可以处理不同类型的异常。
- throw语句：手动抛出一个异常。
- throws关键字：声明一个方法可能抛出的受检异常。
- finally 块：无论是否发生异常，finally 块中的代码都会被执行。通常用于释放资源，如关闭文件或数据库连接。 ### Java 中final、finally和finalize的区别？

| 关键字 | 作用 | 示例/特点 |
| --- | --- | --- |
| final | 修饰类/方法/变量，使其不可变（类不能被继承、方法不能被重写、变量成为常量）。 | final int MAX = 10; final class A {} |
| finally | try-catch 结构中必须执行的代码块（无论是否发生异常），常用于资源释放。 | try { ... } catch { ... } finally { closeResource(); } |
| finalize() | 是 Object 类的 protected 方法，垃圾回收前由 JVM 调用（已过时，不推荐使用）。 | 子类可重写该方法释放资源，但行为不可控，建议用 try-with-resources。 |

**核心差异**：

- final 是修饰符，用于限制变更； 
 
- finally 是异常处理的代码块，确保执行； 
 
- finalize() 是对象生命周期的回调，已被弃用。 ### finally总是会被执行吗？

finally 块几乎总是会被执行，但也有例外情况：

- **正常执行**：如果try或catch 块中的代码正常执行完毕，finally 块会执行。
- **抛出异常**：如果try或catch 块中抛出了异常，并且该异常没有被捕获，finally 块仍会执行。
- **系统退出**：如果在try或catch 块中调用了System.exit(int)方法来终止程序，那么finally 块不会被执行。
- **JVM 崩溃**：如果JVM 本身崩溃，finally 块也不会被执行。 finally 块是非常可靠的，可以用来确保某些清理工作得以完成，例如关闭文件、释放锁或清理资源。但在上述特殊情况下，finally 块可能不会被执行。因此，在编写代码时应考虑这些特殊情况，并采取适当的措施来保证资源的正确释放。

# Java 容器

## 容器基础

### Java 容器有哪些？

Java 中的容器（Containers）指的是用来存储和操作数据的类或接口，主要集中在 java.util 包中。面试里可以先按两条主线回答：一类是单列元素集合 Collection，包括 List、Set、Queue；另一类是键值对映射 Map，包括 HashMap、TreeMap、ConcurrentHashMap 等。

![images/Q1OzbOBtUorv75x3UT8csJNbnVg.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/5f12ad30612c41a0a9c4279b18dee836.png)

images/Q1OzbOBtUorv75x3UT8csJNbnVg.png

### 集合（Collections）

![images/QOT7bkg7Qolx6uxvhr9cqtPMnVb.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/bbdf063db3194d65932dbd95a8d19c27.png)

images/QOT7bkg7Qolx6uxvhr9cqtPMnVb.png

集合框架是 Java 面试中的高频模块，重点不只是记住有哪些实现类，还要能说清它们的底层结构、时间复杂度、线程安全性和适用场景。

#### List（列表）：有序可重复

![images/board-TRcewuFQihbA0zbd8U4cHF2Un0e.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/2c42143a2ba74d478aed39b89419e7ee.png)

images/board-TRcewuFQihbA0zbd8U4cHF2Un0e.png

List 的核心特点是有序、可重复，并且可以通过下标访问元素。面试里问到 List，不要只回答“有序可重复”，最好顺手把 ArrayList、LinkedList、Vector 和 Stack 的设计差异讲出来，因为它们背后的数据结构会直接影响随机访问、插入删除和线程安全。

ArrayList 底层是动态数组，默认初始容量通常是 10，扩容时一般会变成原来的 1.5 倍。它的优势是随机访问很快，get(index) 可以直接根据下标定位元素，时间复杂度是 O(1)。但数组的代价也很明显：如果在中间位置插入或删除元素，需要移动后面的数据，所以这类操作通常是 O(n)。因此，ArrayList 更适合读多写少、按下标访问比较频繁的场景，比如查询结果列表、配置项列表等。

![images/board-NhH5weKnthCSApbJGsfcRwPFnlv.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/e6c27867b8bb4feba9e30e772d00949a.png)

images/board-NhH5weKnthCSApbJGsfcRwPFnlv.png

LinkedList 底层是双向链表，每个节点除了保存元素本身，还保存前后节点的引用。它在首尾插入、删除时很方便，只需要改几个指针；但它不能像数组那样直接根据下标定位元素，随机访问时需要从头或尾开始遍历。也就是说，如果业务里经常按下标读数据，LinkedList 并不合适；如果主要是队列、栈、首尾插入删除这类操作，它才更有发挥空间。

![images/board-PdU1wb3QAhgaFPbPhOccVhFAnkN.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/375a266ad1084cf992f27a9d550474d7.png)

images/board-PdU1wb3QAhgaFPbPhOccVhFAnkN.png

Vector 可以理解成早期的线程安全版 ArrayList，它的方法大多带有 synchronized，所以安全性换来的是额外同步开销。现代项目里一般不会优先选它，如果需要同步包装，可以考虑 Collections.synchronizedList()；如果是高并发场景，则要结合具体读写模型选择并发容器。Stack 继承自 Vector，提供 push()、pop()、peek() 等栈操作，但它的继承设计比较老，实际开发中更推荐用 Deque 来实现栈。

#### Set（集）：无序不可重复

Set 的重点是“不重复”。这里的不重复不是靠肉眼判断，而是依赖对象的 equals() 和 hashCode()，所以面试官经常会顺着追问：为什么重写 equals() 通常也要重写 hashCode()。默认情况下，Set 不保证遍历顺序；如果要保留插入顺序或排序，就要选择不同实现。

![images/board-PdFYwspPFhMtEWbTS8VcTDzkn0b.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/98468053eafe47d9afba6c5bd24fe73d.png)

images/board-PdFYwspPFhMtEWbTS8VcTDzkn0b.png

HashSet 是最常见的实现，底层其实借助 HashMap 存储元素。它适合快速去重、快速判断元素是否存在，比如存一批唯一 ID。正常情况下，添加、删除、查询的平均时间复杂度接近 O(1)，但它不保证遍历顺序，扩容后顺序也可能变化。

如果既要去重，又希望遍历时还能保留插入顺序，可以用 LinkedHashSet。它可以理解为在 HashSet 的哈希表基础上多维护了一条双向链表，所以遍历时会按照插入顺序返回元素。代价是多了一点链表维护成本，但换来了更稳定的输出顺序。

TreeSet 则是另一类思路：它关心的是排序。底层基于红黑树，元素会按照自然顺序或传入的 Comparator 排列，添加、删除和查询一般是 O(log n)。所以它适合需要排序、范围查询这类场景。使用时要注意，元素本身必须可比较，要么实现 Comparable，要么在创建集合时传入 Comparator。

#### Queue（队列）：先进先出（FIFO）

Queue 更像是“等待处理任务”的容器，默认语义是先进先出。它适合描述任务排队、消息缓冲、生产者消费者这类场景。回答时可以先说队列语义，再说明几个常见实现的差异。

LinkedList 实现了 Queue 接口，因此可以作为普通队列使用。入队可以用 add() 或 offer()，出队可以用 remove() 或 poll()，查看队首可以用 element() 或 peek()。这里面更建议记住 offer()、poll()、peek() 这一组，因为它们在失败时不会像另一组方法那样直接抛异常，表达上也更贴近队列操作。

PriorityQueue 不是严格意义上的先进先出队列，它底层是优先级堆，队首元素永远是当前优先级最高的元素。默认情况下可以理解成小顶堆，也可以通过比较器自定义排序规则。它适合任务调度、Top K、按优先级处理请求这类场景。需要注意的是，PriorityQueue 不允许插入 null，元素也必须具备可比较规则。

##### Deque（双端队列）：两端均可操作

Deque 是双端队列，头部和尾部都可以插入、删除，因此它既能当队列用，也能当栈用。实际开发中，如果只是想实现栈结构，通常优先考虑 ArrayDeque，而不是老的 Stack。

ArrayDeque 底层是循环数组，容量可以自动扩展，首尾插入和删除的效率都比较高，而且没有链表节点的额外引用开销。它不支持 null 元素，这反而能减少一些歧义。LinkedList 也实现了 Deque，同样支持双端操作，但每个节点都要维护前后引用，在很多普通场景下并不比 ArrayDeque 更划算。

#### 补充：集合框架的整体结构

Java 集合框架的顶层接口主要有：

- Collection：所有单列集合的根接口（List、Set、Queue 都继承自它），定义了添加、删除、遍历等通用方法。
- Map：键值对集合的根接口（如 HashMap、TreeMap 等，未在上述分类中，因为是双列集合），存储“键-值”映射，键唯一，值可重复。 此外，集合框架中还有一些工具类（如 Collections），提供排序、同步化、查找等静态方法，方便集合操作（例如 Collections.sort(list) 可对 List 排序）。

掌握这些集合的特性，能在实际开发中根据场景选择最合适的实现类，提升程序性能和可读性。

#### 映射（Maps）

![images/DPP5bYOygodVy5xRurFcZZiMnvg.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/400ce8e3b308402ca3cd8e0bd9e08914.png)

images/DPP5bYOygodVy5xRurFcZZiMnvg.png

![images/board-X9HewqXEKhPkK0bzZmncKvgznqf.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/e4eb36911aba4854a87a7d28aed8d2bb.png)

images/board-X9HewqXEKhPkK0bzZmncKvgznqf.png

映射提供的是键值对结构，面试时重点关注四个问题：底层是否有序、是否线程安全、是否允许 null、以及 key 的比较规则是什么。HashMap 是最常见的实现，基于哈希结构存储键值对，平均情况下插入、删除和查找都比较快，但它不保证遍历顺序。LinkedHashMap 在 HashMap 的基础上维护链表，因此可以保留插入顺序或访问顺序，常见于需要稳定遍历结果或实现 LRU 的场景。TreeMap 则换成红黑树结构，牺牲一部分常数性能，换来 key 的有序排列和范围查询能力。

还有一些 Map 更偏特殊用途。IdentityHashMap 比较 key 时看的是 ==，而不是 .equals()，适合少数需要按对象身份区分的场景；WeakHashMap 的 key 是弱引用，适合做一些不希望强引用长期占住对象的缓存结构；ConcurrentHashMap 则是并发场景下的常用选择，JDK 7 主要依赖分段锁，JDK 8 之后主要通过 CAS、synchronized、链表和红黑树等机制提高并发读写性能。 ### Java 容器哪些是线程安全的？哪些是非线程安全的？

Java 中的容器类可以根据其是否支持多线程环境下的安全性分为线程安全和非线程安全两类。线程安全意味着在并发环境中，容器能够正确处理多个线程的访问，不会出现数据不一致的情况。非线程安全则意味着在并发环境下，需要采取额外的同步措施来确保数据的一致性。

![images/T6X6bgGlWodIaox7MG3cRVIcnsf.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/64f6637afe824027adff65bd024b80f8.png)

images/T6X6bgGlWodIaox7MG3cRVIcnsf.png

Java 中线程安全的容器主要包括 Vector、Hashtable、Collections.synchronizedList、ConcurrentHashMap 等；非线程安全的容器主要包括 ArrayList、HashMap、HashSet 等。

早期的线程安全容器主要是 Vector 和 Hashtable，它们通常通过 synchronized 做整体同步，优点是简单，缺点是并发度不高。Collections.synchronizedList/Set/Map 本质上也是给普通集合包一层同步外壳，在简单场景下可以用，但高并发场景里不一定合适。

更常见的做法是根据读写模型选择专门的并发容器。比如 ConcurrentHashMap 适合高并发读写的 Map 场景，CopyOnWriteArrayList 适合读多写少的列表场景，ConcurrentSkipListMap 和 ConcurrentSkipListSet 适合需要有序并发访问的场景。反过来，ArrayList、LinkedList、HashMap、HashSet、StringBuilder 这些默认都不是线程安全的，如果多线程共享并修改，就要加同步控制或换成并发容器。 ### Java 容器 key 和 value 是否能为 null？
| 集合类 | Key | Value | Super | 说明 |
| --- | --- | --- | --- | --- |
| Hashtable | 不允许为 null | 不允许为 null | Dictionary | 线程安全 |
| ConcurrentHashMap | 不允许为 null | 不允许为 null | AbstractMap | 锁分段技术（JDK 8:CAS） |
| TreeMap | 不允许为 null | 允许为 null | AbstractMap | 线程不安全 |
| HashMap | 允许为 null | 允许为 null | AbstractMap | 线程不安全 |

在 Java 中，不同 Map 对 null 的支持规则不同，背后主要是线程安全、排序比较和语义明确性问题。几个常见 Map 的规则如下。

这类题可以直接按“是否会带来语义歧义”来理解。Hashtable 和 ConcurrentHashMap 都不允许 key 或 value 为 null，尤其是 ConcurrentHashMap，如果允许 value 为 null，在并发读取时就很难区分“这个 key 不存在”和“这个 key 存在但值为 null”。TreeMap 的 key 通常也不能为 null，因为它需要对 key 排序，null 没法自然参与比较；value 不参与排序，所以可以为 null。HashMap 的限制最宽松，它允许一个 null key，也允许多个 value 为 null，但在业务代码里仍然要避免把 null 用成含义不清的状态标记。 ## List

### ArrayList 和 Array 的区别？

数组和 ArrayList 的底层都离不开连续存储，但使用方式不一样。数组一旦创建，长度就固定了，如果元素数量变化，只能重新创建数组并复制原有元素；ArrayList 则把这件事封装好了，容量不够时会自动扩容，所以更适合普通业务开发中的动态列表。

另一个差异是使用体验。数组更接近语言底层能力，结构简单，适合长度明确、性能要求直接的场景；ArrayList 属于集合框架，支持泛型，也提供 add()、remove()、contains() 等常用方法，写业务代码会方便很多。面试里可以补一句：ArrayList 的动态能力不是没有代价，扩容时仍然需要创建新数组并复制旧数据。 ### ArrayList 和 LinkedList 的区别

![images/board-KngNwItBKh22OubXymlccxiAnig.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/167d253b680542559cac4590fc7b5539.png)

images/board-KngNwItBKh22OubXymlccxiAnig.png

ArrayList 和 LinkedList 的区别，本质上是动态数组和双向链表的区别。ArrayList 可以根据下标直接定位元素，所以随机访问是 O(1)，但在中间插入或删除时需要移动后续元素。LinkedList 刚好相反，它改指针很方便，首尾插入删除效率高，但按下标访问需要遍历，通常是 O(n)。

实际项目里不要简单说“插入删除多就用 LinkedList”。如果不是已经定位到节点，中间插入前仍然要先遍历过去，这个成本并不低；同时 LinkedList 每个节点还要保存前后引用，内存占用也更高。多数普通列表场景，ArrayList 仍然是更常用的默认选择。 ### ArrayList 的扩容机制

![images/board-PLLewME2AhlaN3bmFTJc6gh1n0d.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/9cbbc02d9832455a823e7639fd4f548f.png)

images/board-PLLewME2AhlaN3bmFTJc6gh1n0d.png

ArrayList 在创建时会有一个初始容量。当添加的元素超过了当前容量时，ArrayList 会自动扩容。扩容的具体机制如下：

1. **初始容量**：默认情况下，ArrayList 的初始容量为 10。你可以通过构造函数指定一个初始容量。
2. **扩容策略**：当 ArrayList 的大小超过其容量时，它会创建一个新的数组，并将旧数组中的所有元素复制到新数组中。新的数组的容量通常是旧容量的 1.5 倍（即增加 50%）。
3. **扩容过程**：

- ensureCapacityInternal 方法用于确保容量足够。
- grow 方法负责实际的扩容操作。
- 新的数组会通过 Arrays.copyOf 方法创建，并将旧数组中的元素复制到新数组中。
- 最后，ArrayList 的引用会指向新的数组。 ## HashSet、LinkedHashSet、TreeSet 的区别

这三个类都能完成去重，但关注点不一样。

HashSet 最朴素，底层依赖 HashMap，元素会作为 key 存进去，value 则是一个固定的占位对象。它的优势是快，添加、删除、查找的平均时间复杂度接近 O(1)，但它不关心顺序，所以遍历结果不能当成稳定顺序来用。只要业务目标是“去重”和“快速判断是否存在”，并且不要求顺序，HashSet 通常就够了。

LinkedHashSet 可以理解为“带顺序的 HashSet”。它在哈希表之外多维护了一条双向链表，所以既能去重，也能按照插入顺序遍历。它比 HashSet 多一点链表维护成本，但在需要输出顺序稳定的场景里会更合适，比如日志去重、配置项去重、页面展示前的去重。

TreeSet 解决的是排序问题。它底层基于红黑树，元素会按自然顺序或比较器规则排列，增删查的复杂度通常是 O(log n)。如果面试官追问为什么不是 O(1)，可以顺着解释：TreeSet 牺牲了一部分常数性能，换来的是有序性和范围查询能力。因此它更适合排行榜、区间筛选、按规则排序后的去重等场景。

## Map相关

### HashMap 和 HashSet 的区别

![images/board-ZlZOwkc6hhzRDmb4vcvcQ4fBnLc.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/37c1acb8c3594331bef537a884c30a1d.png)

images/board-ZlZOwkc6hhzRDmb4vcvcQ4fBnLc.png

HashMap 和 HashSet 很容易放在一起问，因为 HashSet 底层就是借助 HashMap 实现的。区别在于，HashMap 存的是 key-value，一般用 key 找 value；HashSet 存的是单个元素，主要用来去重和判断元素是否存在。

从实现上看，HashSet 会把元素当成 HashMap 的 key，value 则放一个固定的占位对象。因此它们都依赖哈希计算，也都要求对象的 hashCode() 和 equals() 实现合理。面试里如果能把这层关系说出来，比单纯背“一个存键值对，一个存元素”更完整。 ### HashMap 和 Hashtable 的区别？

![images/board-LR7fw3bTYh93ZWbnCP8czhSGn1e.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/40e2abc08ee34afd81e25e41717bf18f.png)

images/board-LR7fw3bTYh93ZWbnCP8czhSGn1e.png

HashMap 和 Hashtable 是 Java 中常用的哈希表实现，但两者之间有几个关键的区别：

HashMap 和 Hashtable 最大的区别在于历史包袱和同步方式。Hashtable 是早期集合类，方法上带有 synchronized，所以线程安全但并发性能较差；HashMap 不做同步，单线程或外部已保证线程安全的场景里更常用。两者对 null 的态度也不同：HashMap 允许一个 null key 和多个 null value，而 Hashtable 不允许 key 或 value 为 null。实际开发中，Hashtable 基本不作为首选，如果需要并发 Map，更常见的是使用 ConcurrentHashMap。 ### HashMap 和 ConcurrentHashMap 的区别

![images/board-G9z3wHoPMhX7ajbiM4Uc53WWnZg.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/f71db2bf3fd440cb8df902cfd84c95e9.png)

images/board-G9z3wHoPMhX7ajbiM4Uc53WWnZg.png

HashMap 和 ConcurrentHashMap 都是哈希表实现，但 ConcurrentHashMap 是专门为高并发环境设计的：

HashMap 适合单线程或外部已经控制并发的场景，ConcurrentHashMap 则是多线程读写下的常用选择。它不是简单地给整张表加一把大锁，而是通过更细粒度的并发控制降低锁竞争：JDK 7 主要是分段锁，JDK 8 之后取消 Segment 数组，更多依赖 CAS、synchronized、链表和红黑树来协作。它还提供了 putIfAbsent、条件删除等并发友好的方法，能减少“先判断再操作”之间的竞态问题。 ### HashMap 如何解决哈希冲突的？

![images/board-PMrxw71CKhSmnzbhJW5cIz2XnKh.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/fee5bf2fe3774fb5a863a27ee77e7107.png)

images/board-PMrxw71CKhSmnzbhJW5cIz2XnKh.png

HashMap 通过“数组 + 链表 / 红黑树”解决哈希冲突。当多个元素经过哈希计算后落到同一个桶（bucket）中时，会先以链表形式挂在同一个桶下；在 JDK 8 中，如果链表长度达到阈值且数组容量足够大，链表会转换为红黑树，从而降低极端冲突场景下的查询复杂度。

### HashMap 为什么线程不安全？如何实现线程安全？

HashMap 是非线程安全的，主要原因在于它的扩容机制和内部操作没有进行同步。当多个线程同时进行写操作时，可能会出现以下问题：

HashMap 的线程不安全主要来自并发写入。多个线程同时修改数组、链表或红黑树结构时，可能导致数据覆盖、结构不一致，遍历时也可能出现并发修改异常。解决思路有三类：简单场景可以在外层加 synchronized，或者用 Collections.synchronizedMap 包装；如果本身就是高并发读写，更推荐直接使用 ConcurrentHashMap，因为它的并发控制粒度更合理。 # 并发编程

并发编程是央国企 Java 面试里的核心盘。回答这部分问题时，不能只背“线程、锁、线程池”三个名词，而要能说明线程状态如何变化、锁为什么会升级、线程池参数如何影响资源使用，以及线上系统为什么要避免无限制创建线程。

## 线程和进程

### 线程、进程的区别？

![images/board-BjZgwy8FthsuQRb9U8Kct52KnQh.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/341d3fb9787e4420a6950fb6b5753bd6.png)

images/board-BjZgwy8FthsuQRb9U8Kct52KnQh.png

- **进程**：指计算机中正在执行的一个程序实例。它包括了程序的代码、数据和运行时的状态。每个进程都有自己独立的内存空间，它们之间不能直接访问对方的内存。进程之间是相互独立的，它们在操作系统中被视为独立的个体，可以独立调度和管理。每个进程都有一个唯一的进程标识符（Process Identifier，PID）用于标识和管理。
- **线程**：是进程的执行单元。一个进程可以包含多个线程，它们共享相同的内存空间和其他资源。线程是进程内的一个独立执行流，它可以看作是进程的一个子任务。不同的线程可以并发地执行，它们之间可以共享数据和资源，相比于创建多个独立的进程，使用线程可以更有效地利用系统资源。线程之间的切换开销相对较小，因为它们共享了相同的上下文环境。

### 说说线程创建的3种方法？

**（1）继承 Thread 类，重写 run() 方法**

class MyThread extends Thread { 
@Override 
public void run() { 
// 线程执行逻辑 
} 
} 
 
MyThread thread = new MyThread(); 
thread.start();

**（2）实现 Runnable 接口，重写 run() 方法**

class MyRunnable implements Runnable { 
@Override 
public void run() { 
// 线程执行逻辑 
} 
} 
 
MyRunnable runnable = new MyRunnable(); 
Thread thread = new Thread(runnable); 
thread.start();

**（3）实现 Callable 接口，配合线程池和 Future 获取结果**

在 Java 中，Callable 一般用于需要返回结果、并且可能抛出异常的异步任务。它和 Runnable 最大的区别在于：Callable 可以返回执行结果，任务通常交给 ExecutorService 调度，再通过 Future 获取结果。

import java.util.concurrent.Callable; 
import java.util.concurrent.ExecutorService; 
import java.util.concurrent.Executors; 
import java.util.concurrent.Future; 
 
class MyCallable implements Callable { 
@Override 
public Integer call() { 
return 42; 
} 
} 
 
ExecutorService executor = Executors.newSingleThreadExecutor(); 
Future future = executor.submit(new MyCallable()); 
 
try { 
Integer result = future.get(); 
System.out.println("结果: " + result); 
} catch (Exception e) { 
e.printStackTrace(); 
} finally { 
executor.shutdown(); 
}

面试里可以补一句：真正的业务系统一般不建议手动频繁 new Thread()，而是通过线程池统一管理线程数量、任务队列、拒绝策略和资源回收。

### 线程生命周期

![images/board-L9vwwyCRzh30QfbUA4Cc8spRnqf.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/3fde1e309cb74f5a87466450d27f02c7.png)

images/board-L9vwwyCRzh30QfbUA4Cc8spRnqf.png

在 Java 中，线程可以处于不同的状态，这些状态反映了线程在不同阶段的行为和状态变化。Java 中的线程状态可以分为以下几种：

1. 新建（New）状态：当线程对象被创建但还没有调用start()方法时，线程处于新建状态。此时，线程已经被创建但还没有启动执行。
2. 可运行（Runnable）状态：当线程对象调用了start()方法后，线程进入可运行状态。在可运行状态下，线程已经具备了运行的条件，但并不一定正在执行，可能正在等待CPU的调度。
3. 运行（Running）状态：在可运行状态下，线程被CPU调度执行时，线程进入运行状态。在运行状态下，线程正在执行其任务代码。
4. 阻塞（Blocked）状态：在某些情况下，线程可能会被阻塞。例如，线程在等待获取锁、等待输入输出完成、等待其他线程的通知等情况下，线程会进入阻塞状态。在阻塞状态下，线程暂时停止执行，直到满足了阻塞条件才能继续执行。
5. 等待（Waiting）状态：线程可以通过调用Object类的wait()、Thread类的join()、LockSupport类的park()等方法进入等待状态。在等待状态下，线程暂时停止执行，并释放占有的锁，直到其他线程发出通知或等待时间到达。
6. 超时等待（Timed Waiting）状态：类似于等待状态，线程通过调用具有超时参数的wait()、join()、sleep()等方法，进入超时等待状态。在超时等待状态下，线程暂时停止执行，直到其他线程发出通知、等待时间到达或超时时间到达。
7. 终止（Terminated）状态：线程执行完其任务代码或出现了未捕获的异常时，线程进入终止状态。在终止状态下，线程的执行已经结束，不再具备执行的条件。 ## 锁

### Java 中锁的分类

![images/ZJkgb5C2QoAiEuxWC9ycQt18nKg.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/ba1349c63269409fb875ac5ce8161de0.png)

images/ZJkgb5C2QoAiEuxWC9ycQt18nKg.png

### （1） 可重入锁、不可重入锁

class A{ 
 
synchronized void fun(){ 
synchronized(A.class){ 
//... 
} 
} 
 
void main(){ 
A objA = new A(); 
synchronized(objA){ 
//... 
//... 
//... 
//... 
} 
} 
}

可重入锁指的是同一个线程已经持有某把锁时，可以再次获取这把锁而不会把自己阻塞住。Java 里的 synchronized、ReentrantLock、ReentrantReadWriteLock 都支持可重入。这个设计主要是为了避免同一个线程在方法嵌套调用时发生自我死锁。不可重入锁则相反，同一个线程如果重复获取同一把锁，也会被阻塞，使用不当就容易出现自己等自己的问题。

### （2）乐观锁、悲观锁

悲观锁和乐观锁的区别，关键在于对冲突的预期不同。悲观锁默认认为冲突会发生，所以访问共享资源之前先加锁，典型实现就是 synchronized 和 ReentrantLock。它的优势是语义直接、一致性强，代价是线程可能阻塞，带来上下文切换。

乐观锁默认认为冲突不多，所以先不加锁，更新时再检查数据有没有被别人改过。常见实现是版本号或 CAS。它适合读多写少、冲突概率不高的场景；如果竞争非常激烈，CAS 反复失败，就会消耗大量 CPU。面试里可以用一句话收尾：冲突多、强一致要求高时偏悲观锁；冲突少、追求吞吐时可以考虑乐观锁。

### （3）公平锁、非公平锁

![images/board-Cg3Vwgrc4hQRZKbAAU5caSUSnCe.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/74c821bb6f244351be8421c11ecbe5d5.png)

images/board-Cg3Vwgrc4hQRZKbAAU5caSUSnCe.png

在 Java 中，公平锁（Fair Lock）和非公平锁（Nonfair Lock）是锁机制的两种实现方式，用于控制多个线程对共享资源的访问顺序。

synchronized 只能是非公平锁，而 ReentrantLock、ReentrantReadWriteLock 可以选择公平或非公平。公平锁强调先来先得，线程按照等待顺序排队获取锁，优点是减少饥饿，缺点是吞吐量可能下降，因为每次都要维护严格顺序。

在 Java 中，通过 ReentrantLock 类的构造函数可以创建一个公平锁，如下所示：

ReentrantLock lock = new ReentrantLock(true); // 公平锁

非公平锁不保证等待顺序，后来的线程可能刚好抢到锁。它看起来“不公平”，但减少了排队和唤醒成本，吞吐量通常更好。默认的 ReentrantLock 就是非公平锁：

ReentrantLock lock = new ReentrantLock(); // 非公平锁

所以公平和非公平不影响锁能不能保证线程安全，它们影响的是锁的获取顺序和调度成本。

### （4） 互斥锁、共享锁

![images/board-HyMaw1utXhAvZZbRIrWcE5tRnqd.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/7a70acea7cd94142ac0f0c427edaf6ef.png)

images/board-HyMaw1utXhAvZZbRIrWcE5tRnqd.png

互斥锁强调独占，同一时刻只能有一个线程进入临界区，synchronized 和 ReentrantLock 都属于这种思路。共享锁强调多个线程可以同时读，只要没有线程写，就不必互相阻塞。ReentrantReadWriteLock 就是典型例子：读锁是共享锁，多个读线程可以并发；写锁是互斥锁，写入时需要独占。读多写少的场景下，读写锁比普通互斥锁更容易提高并发度。

### （5）分段锁

![images/board-LO6zw0HH6hwXKzbLN6EcJr71nLW.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/685f1523dee34a24864126426f52a908.png)

images/board-LO6zw0HH6hwXKzbLN6EcJr71nLW.png

分段锁（Segmented Locking）是一种在多线程环境中提高并发性能的技术。它通过将数据结构分成多个独立的部分（段），并在每个部分上使用独立的锁来减少锁的竞争，从而提高并发访问的效率。分段锁的思想是将一个大的锁分解成多个小的锁，这样可以允许多个线程同时访问不同的段，而不是阻塞所有线程。

在 Java 中，ConcurrentHashMap 是一个典型的使用分段锁的数据结构。在 JDK 7 及之前版本中，ConcurrentHashMap 使用了分段锁来提高并发性能。从 JDK 8 开始，ConcurrentHashMap 使用了更先进的 CAS 和锁膨胀技术，但分段锁的思想仍然值得学习。

### （6）偏向锁、轻量级锁、重量级锁 —— synchronized

synchronized 的锁优化，核心是尽量避免一上来就把线程挂起。线程阻塞和唤醒需要操作系统参与，成本比较高，所以 JVM 会根据锁竞争程度，在无锁、偏向锁、轻量级锁和重量级锁之间逐步升级。

#### a. 重量级锁（Heavyweight Lock）

**重量级锁**是最传统的锁机制，通常指的是 synchronized 关键字。在早期的 Java 版本中，synchronized 会涉及操作系统级别的线程调度和上下文切换，因此性能开销比较明显。它的核心价值是提供互斥和可见性，但代价是线程阻塞、唤醒时会产生较重的调度成本。

#### b.轻量级锁（Lightweight Lock）

**轻量级锁**是在竞争不激烈时使用的一种优化。线程不会立刻进入阻塞，而是先通过 CAS 尝试修改对象头里的锁标志；如果暂时抢不到锁，会短暂自旋等待。这样做的前提是锁持有时间很短，自旋几次就可能拿到锁，省掉线程挂起和唤醒的成本。如果竞争持续加剧，自旋就不划算了，锁会进一步升级为重量级锁。

#### c.偏向锁（Biased Locking）

**偏向锁**针对的是“几乎没有竞争”的情况。它假设锁大概率一直被同一个线程反复获取，于是会把锁偏向第一次获取它的线程，后续同一个线程再进入同步块时，就不必反复做 CAS。只要没有其他线程来竞争，这个成本就很低；一旦其他线程也来抢锁，偏向关系会被撤销，锁可能升级为轻量级锁或重量级锁。

#### d.锁的升级过程

可以把锁升级理解成 JVM 对竞争程度的判断：没有竞争时尽量偏向一个线程；出现轻微竞争时用 CAS 和自旋扛一下；竞争很激烈或自旋时间过长时，再升级为重量级锁，让线程阻塞等待。这个过程强调的是“按需付费”：竞争越重，锁的实现越重。

### （7）自旋锁

自旋锁（Spin Lock）的思想很直接：抢不到锁时，线程先不挂起，而是在 CPU 上循环尝试获取锁。它适合锁持有时间非常短的场景，因为线程可能很快就能等到锁释放，从而避免上下文切换。问题也在这里：自旋期间线程一直占着 CPU，如果锁竞争很激烈，或者持锁线程执行时间很长，自旋就会变成纯消耗。所以回答自旋锁时，重点不是说“它更快”，而是说清楚它快在避免阻塞，慢在可能浪费 CPU。

## 说说synchronized？

synchronized 是 Java 中用于控制多线程访问共享资源的一种同步机制。它可以通过关键字的形式应用于方法或代码块，确保同一时刻只有一个线程能够执行被 synchronized 修饰的方法或代码块。通常的使用方式包括修饰同步方法和修饰同步代码块，如下图：

![images/N5dUb6dE7o5H2kx5BliceLP5neb.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/3506c543bf7344dc9b497d4ecda6a7d3.png)

images/N5dUb6dE7o5H2kx5BliceLP5neb.png

回答 synchronized 时，可以抓住三个点。第一，它提供互斥，同一时刻只有一个线程能进入被保护的方法或代码块；第二，它保证可见性，线程释放锁之前对共享变量的修改，后续获取同一把锁的线程能够看到；第三，它是可重入的，同一个线程已经持有锁时，可以再次进入同一把锁保护的代码，而不会把自己阻塞住。

[synchronized原理](https://ecnhcesakwkz.feishu.cn/wiki/KeGgwHfzVi8SW9kPj1wckMAJn7b?fromScene=spaceOverview#share-BYGudp9HeoEVE6xwPUbcmg59nzf)

## 说说ReentrantLock？

ReentrantLock 是 java.util.concurrent.locks 包里的可重入互斥锁。它和 synchronized 都能解决互斥问题，但 ReentrantLock 给了开发者更多控制权，比如可以选择公平锁或非公平锁，可以在等待锁时响应中断，也可以用 tryLock() 做超时获取，避免线程无限等待。它还支持多个 Condition 条件队列，适合需要更复杂等待/通知关系的场景。

所以这道题不要只说“ReentrantLock 更灵活”。更准确的表达是：普通互斥场景下 synchronized 更简单；当业务需要可中断、可超时、公平性控制或多个条件队列时，ReentrantLock 更合适，但使用时也要手动 unlock()，通常要放在 finally 里保证释放。

## 什么是CAS？

![images/board-KdEgwAraYhJLrFbet0tcFXaHn7d.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/fd7c0531a0034b35ac6c88a1359ec376.png)

images/board-KdEgwAraYhJLrFbet0tcFXaHn7d.png

**CAS**（Compare-and-Swap，比较并交换）是一种无锁原子操作。它会拿内存中的当前值和预期值比较：如果两者一致，就把当前值改成新值；如果不一致，说明中间已经被其他线程改过，本次操作失败。这个比较和替换是一个原子动作，因此可以用来实现很多无锁并发工具。

CAS 的好处是不用显式加锁，避免了线程阻塞和唤醒的成本，在竞争不激烈时效率很高。它的问题也很典型：一是 ABA 问题，也就是值从 A 变成 B 又变回 A，CAS 只看最终值，可能误以为没有变化，可以用 AtomicStampedReference 这类带版本号的工具缓解；二是高竞争下可能反复 CAS 失败，线程一直循环重试，CPU 开销会变大；三是它更适合简单原子更新，复杂同步逻辑仍然需要锁或更高层的并发工具。

在 Java 中，java.util.concurrent.atomic 包提供了一系列基于 CAS 的原子类，常见的包括：

- AtomicInteger：提供原子的整数操作。
- AtomicLong：提供原子的长整数操作。
- AtomicBoolean：提供原子的布尔值操作。
- AtomicReference：提供原子的引用类型操作。
- AtomicStampedReference：提供带有版本号的原子引用类型操作，用于解决 ABA 问题。
- AtomicIntegerFieldUpdater：提供对指定类的指定 volatile int 字段的原子更新操作。
- AtomicLongFieldUpdater：提供对指定类的指定 volatile long 字段的原子更新操作。
- AtomicReferenceFieldUpdater：提供对指定类的指定 volatile 引用字段的原子更新操作。 ## 什么是死锁

![images/board-HCJfwrFFLhb3OLbMYtBcJka4nxf.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/b796814c7ddf4ac69b26ea6a2bc56f03.png)

images/board-HCJfwrFFLhb3OLbMYtBcJka4nxf.png

多个进程（或线程）竞争资源时，互相等待对方释放自己需要的资源，导致所有进程都无法继续执行，陷入“僵持”状态，这种情况就是死锁。

死锁一般需要同时满足四个条件：资源互斥、持有资源的同时继续等待新资源、资源不能被强制剥夺，以及多个线程之间形成循环等待。比如线程 A 拿着锁 1 等锁 2，线程 B 拿着锁 2 等锁 1，两边都不释放，就会卡住。

解决死锁的思路不是背算法名，而是破坏这些条件。实际项目里常见做法包括固定加锁顺序，避免循环等待；缩小锁粒度，减少持锁时间；获取锁失败时设置超时，避免无限等待；必要时通过监控和线程 dump 定位死锁现场。

## 线程池

### 什么是线程池？

线程池可以理解成一组可复用的工作线程。业务提交任务后，线程池不会每次都重新创建线程，而是把任务放进队列或交给已有线程执行。它解决的不是“能不能多线程”，而是“多线程的数量、排队和失败策略如何被控制”。

#### 1）线程池的工作原理

任务提交到线程池后，线程池会先看核心线程是否够用；如果核心线程已满，任务会进入工作队列；如果队列也满了，才会继续创建非核心线程，直到达到最大线程数；如果最大线程数也满了，就触发拒绝策略。这个流程比单纯说“线程复用”更重要，因为它决定了高峰期任务是被排队、扩容处理，还是被拒绝。

#### 2）线程池的优点

线程池的价值主要体现在三个方面：复用线程，减少频繁创建和销毁的成本；限制线程数量，避免请求一多就把机器资源打满；通过队列和拒绝策略给系统一个缓冲和兜底。面试里可以把它和线上稳定性联系起来讲：线程池参数配置不好，可能导致任务堆积、接口超时、CPU 飙高，甚至把下游系统拖垮。

### 为什么需要线程池？

需要线程池，本质上是因为线程本身也是资源。每来一个任务就创建一个线程，看起来简单，但在高并发下会带来大量上下文切换、内存占用和调度成本。线程池通过复用线程、限制最大线程数、配置队列和拒绝策略，把并发控制在一个可承受范围内。对于接口异步处理、批量任务、定时任务、消息消费等场景，这种资源边界尤其重要。 ### Java创建线程池的核心参数？

![images/board-OrkXwgmGchIC8wbqUw1cpqkGn2e.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/f99b0250eecd406c861425c34b8efda2.png)

images/board-OrkXwgmGchIC8wbqUw1cpqkGn2e.png

在 Java 中，真正需要掌握的是 ThreadPoolExecutor 的几个核心参数。它们共同决定了线程池在低峰、高峰和过载时分别怎么处理任务：
| 参数名称 | 描述 | 作用 | 常见类型/值 |
| --- | --- | --- | --- |
| 核心线程数 (corePoolSize) | 线程池中保持的最小线程数，即使这些线程处于空闲状态也不会被销毁。 | 确保线程池中始终有足够数量的线程来处理任务，提高响应速度。 | 例如：5 |
| 最大线程数 (maximumPoolSize) | 线程池中允许的最大线程数。 | 限制系统中活动线程的数量，防止因大量线程同时运行而导致系统资源耗尽。 | 例如：10 |
| 空闲线程存活时间 (keepAliveTime) | 当线程池中的线程数超过核心线程数时，多余的空闲线程在等待新任务时的最长等待时间。 | 控制线程池的资源占用，减少不必要的线程开销。 | 例如：60秒，单位通过 TimeUnit参数指定，如TimeUnit.SECONDS |
| 工作队列 (workQueue) | 用于保存等待执行的任务的队列。 | 管理任务的排队和调度，影响线程池的吞吐量和响应时间。 | ArrayBlockingQueue：有界队列，固定大小的数组实现。 LinkedBlockingQueue：无界队列，基于链表实现。SynchronousQueue：不存储元素的队列，每个插入操作必须等待一个对应的移除操作。PriorityBlockingQueue：支持优先级排序的无界队列。 |
| 拒绝策略 (handler) | 当线程池和工作队列都已满时，如何处理新提交的任务。 | 控制任务的处理方式，确保系统在高负载下仍能正常运行。 | AbortPolicy：默认策略，抛出 RejectedExecutionException异常。CallerRunsPolicy：由调用线程（提交任务的线程）执行该任务。DiscardPolicy：直接丢弃任务。DiscardOldestPolicy：丢弃队列中最老的任务，然后重新尝试提交新任务。 |

下面是一个自定义线程池示例：

import java.util.concurrent.\*; 
 
public class ThreadPoolExecutorExample { 
public static void main(String\[\] args) { 
// 创建线程池 
ThreadPoolExecutor executorService = new ThreadPoolExecutor( 
5, // corePoolSize 
10, // maximumPoolSize 
60, // keepAliveTime 
TimeUnit.SECONDS, // time unit for keepAliveTime 
new LinkedBlockingQueue<>(100), // workQueue 
Executors.defaultThreadFactory(), // threadFactory 
new ThreadPoolExecutor.CallerRunsPolicy() // handler 
); 
 
// 提交15个任务 
for (int i = 0; i { 
System.out.println("Task " + taskId + " is running by " + Thread.currentThread().getName()); 
try { 
Thread.sleep(1000); // 模拟任务执行时间 
} catch (InterruptedException e) { 
e.printStackTrace(); 
} 
}); 
} 
 
// 关闭线程池 
executorService.shutdown(); 
} 
}

这个例子里，核心线程数是 5，最大线程数是 10，队列容量是 100。当任务量超过核心线程处理能力时，任务会先进入有界队列；队列满了之后，线程数才会继续增长到最大线程数；如果仍然处理不过来，就由 CallerRunsPolicy 让提交任务的线程自己执行，起到一定的反压作用。 ### Java 中线程池分类

![images/NQpAbJVZJoP8TGxH4lhc5mqfnHe.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/258a4a0c1cad48bd9a43747a1ff0fab5.png)

images/NQpAbJVZJoP8TGxH4lhc5mqfnHe.png

在 Java 中，java.util.concurrent 包提供了多种常用线程池。复习这一块时，不建议只背 API 名称，更重要的是理解它们背后的线程数量、队列策略和适用边界。面试里如果能顺着讲出“为什么这个线程池适合这个场景”，比单纯列名字更有说服力。

#### 1）固定线程池 (newFixedThreadPool)

固定线程池会创建固定数量的工作线程。线程数达到上限后，新任务不会继续创建新线程，而是进入任务队列等待空闲线程处理。它比较适合任务量相对稳定、并发规模可预估的场景；如果任务突然堆积很多，就要额外关注队列长度和内存压力。

简单示例：

import java.util.concurrent.ExecutorService; 
import java.util.concurrent.Executors; 
 
public class FixedThreadPoolExample { 
public static void main(String\[\] args) { 
// 创建一个固定大小为5的线程池 
ExecutorService executorService = Executors.newFixedThreadPool(5); 
 
// 提交10个任务 
for (int i = 0; i { 
System.out.println("Task " + taskId + " is running by " + Thread.currentThread().getName()); 
try { 
Thread.sleep(1000); // 模拟任务执行时间 
} catch (InterruptedException e) { 
e.printStackTrace(); 
} 
}); 
} 
 
// 关闭线程池 
executorService.shutdown(); 
} 
}

#### 2）缓存线程池 (newCachedThreadPool)

缓存线程池的线程数量会随着任务量动态变化。空闲线程可以被回收，任务来得多时也可能快速创建新线程，所以它适合大量短生命周期任务。不过这类线程池没有固定上限，如果任务提交速度失控，容易把线程数拉得很高，真实项目里要谨慎使用。

简单示例：

import java.util.concurrent.ExecutorService; 
import java.util.concurrent.Executors; 
 
public class CachedThreadPoolExample { 
public static void main(String\[\] args) { 
// 创建一个可缓存的线程池 
ExecutorService executorService = Executors.newCachedThreadPool(); 
 
// 提交10个任务 
for (int i = 0; i { 
System.out.println("Task " + taskId + " is running by " + Thread.currentThread().getName()); 
try { 
Thread.sleep(1000); // 模拟任务执行时间 
} catch (InterruptedException e) { 
e.printStackTrace(); 
} 
}); 
} 
 
// 关闭线程池 
executorService.shutdown(); 
} 
}

#### 3）单线程线程池 (newSingleThreadExecutor)

单线程线程池内部只有一个工作线程，因此提交进去的任务会按顺序执行。它适合对执行顺序有要求的场景，例如串行写日志、顺序消费某类任务等。需要注意的是，如果前面的任务阻塞，后面的任务也会被拖住，所以它不适合承载耗时不可控的大量任务。

简单示例：

import java.util.concurrent.ExecutorService; 
import java.util.concurrent.Executors; 
 
public class SingleThreadExecutorExample { 
public static void main(String\[\] args) { 
// 创建一个单线程的线程池 
ExecutorService executorService = Executors.newSingleThreadExecutor(); 
 
// 提交10个任务 
for (int i = 0; i { 
System.out.println("Task " + taskId + " is running by " + Thread.currentThread().getName()); 
try { 
Thread.sleep(1000); // 模拟任务执行时间 
} catch (InterruptedException e) { 
e.printStackTrace(); 
} 
}); 
} 
 
// 关闭线程池 
executorService.shutdown(); 
} 
}

#### 4）定时任务线程池 (newScheduledThreadPool)

定时任务线程池用于延迟执行或周期执行任务，比如定时刷新缓存、定时同步数据、周期性巡检等。它比普通线程池多了调度能力，但也要注意任务执行时间和周期之间的关系：如果任务执行时间过长，可能影响后续调度节奏。

简单示例：

import java.util.concurrent.Executors; 
import java.util.concurrent.ScheduledExecutorService; 
import java.util.concurrent.TimeUnit; 
 
public class ScheduledThreadPoolExample { 
public static void main(String\[\] args) { 
// 创建一个支持定时任务的线程池 
ScheduledExecutorService executorService = Executors.newScheduledThreadPool(5); 
 
// 提交一个延迟执行的任务 
executorService.schedule(() -> { 
System.out.println("Delayed task is running by " + Thread.currentThread().getName()); 
}, 5, TimeUnit.SECONDS); 
 
// 提交一个周期性执行的任务 
executorService.scheduleAtFixedRate(() -> { 
System.out.println("Periodic task is running by " + Thread.currentThread().getName()); 
}, 0, 2, TimeUnit.SECONDS); 
 
// 为了防止程序立即退出，让主线程睡眠一段时间 
try { 
Thread.sleep(10000); 
} catch (InterruptedException e) { 
e.printStackTrace(); 
} 
 
// 关闭线程池 
executorService.shutdown(); 
} 
}

#### 5）自定义线程池 (ThreadPoolExecutor)

实际项目里更推荐直接使用 ThreadPoolExecutor 自定义线程池，因为它能明确配置核心线程数、最大线程数、空闲线程存活时间、工作队列、线程工厂和拒绝策略。这样线程池的行为更可控，也更容易根据业务吞吐量、接口耗时和机器资源做调参。

简单示例：

import java.util.concurrent.\*; 
 
public class CustomThreadPoolExample { 
public static void main(String\[\] args) { 
// 创建自定义线程池 
ThreadPoolExecutor executorService = new ThreadPoolExecutor( 
5, // corePoolSize 
10, // maximumPoolSize 
60, // keepAliveTime 
TimeUnit.SECONDS, // time unit for keepAliveTime 
new LinkedBlockingQueue<>(100), // workQueue 
Executors.defaultThreadFactory(), // threadFactory 
new ThreadPoolExecutor.CallerRunsPolicy() // handler 
); 
 
// 提交15个任务 
for (int i = 0; i { 
System.out.println("Task " + taskId + " is running by " + Thread.currentThread().getName()); 
try { 
Thread.sleep(1000); // 模拟任务执行时间 
} catch (InterruptedException e) { 
e.printStackTrace(); 
} 
}); 
} 
 
// 关闭线程池 
executorService.shutdown(); 
} 
}

线程池这一块面试时可以用一句话收尾：不要为了“异步”就随便创建线程，真正要说明的是任务量有多大、执行时间是否稳定、是否要求顺序、队列是否可能堆积，以及拒绝策略如何兜底。

# [Spring&Spring Boot基础](https://s.shutu.cn/w/1rez2o)

![images/WUWBbJ55Xo6xLhxYmXqc0mzJnNh.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/df7996a8efa04ce2ab0eff2ce37fc059.png)

images/WUWBbJ55Xo6xLhxYmXqc0mzJnNh.png

## Spring、Spring MVC和Spring Boot关系

可以把这三者看成从基础框架到 Web 层再到工程脚手架的关系。Spring 是底座，核心能力是 IoC 和 AOP，负责对象创建、依赖注入、生命周期管理以及事务、切面等通用能力。Spring MVC 是 Spring 体系里的 Web 框架，主要负责接收 HTTP 请求、参数绑定、调用业务逻辑、返回响应。Spring Boot 则是在 Spring 之上做自动配置和快速启动，内置 Web 容器、默认依赖组合和约定式配置，让项目更容易搭起来。

面试里不要把 Spring Boot 说成“替代 Spring”。更准确的说法是：Spring Boot 简化了 Spring 项目的配置和启动方式，但底层仍然大量依赖 Spring 容器、Spring MVC、自动装配和条件装配机制。

## IoC（控制反转）

IoC是一种设计思想，指将对象的创建和管理控制权从应用程序代码转移到外部容器（即IoC容器，如Spring容器 ）。在Spring中，开发者只需在配置文件或使用注解声明对象及依赖关系，容器负责创建对象实例、注入依赖等。比如定义一个UserService类，通过@Autowired注解让Spring容器自动注入其依赖的UserRepository，而不用在UserService内部手动创建UserRepository实例，降低了代码耦合度。

## Spring Bean

Spring Bean是被Spring IoC容器管理的对象。这些对象在Spring容器中创建、初始化、销毁，其定义可通过XML配置文件、注解（如@Component、@Service 等）或Java配置类（@Configuration搭配@Bean ）来声明。例如使用@Service注解标注的业务层类，就会被Spring容器识别为一个Bean并进行管理。

## Bean的生命周期

Bean 的生命周期可以按“创建、注入、初始化、使用、销毁”来讲。容器先根据 Bean 定义创建对象，然后完成依赖注入；属性准备好之后，会执行一系列初始化扩展点，例如 Aware 回调、BeanPostProcessor、InitializingBean 或自定义 initMethod。Bean 初始化完成后进入可用状态，容器关闭时再执行销毁逻辑，例如 DisposableBean 或自定义 destroyMethod。

这道题真正容易被追问的是扩展点。比如为什么很多框架能在 Bean 初始化前后增强对象，原因就是 Spring 暴露了 BeanPostProcessor 这类生命周期钩子，AOP 代理对象也常常和这个阶段有关。

## AOP（面向切面编程）

AOP 用来处理横切关注点，也就是那些分散在多个业务模块里、但逻辑又高度相似的能力，比如事务、日志、权限校验、接口耗时统计。它的基本思路是：用切点定位哪些方法需要增强，用通知定义增强逻辑，再由切面把两者组织起来。Spring AOP 底层通常通过代理实现，所以它更适合方法级增强，而不是随意拦截代码中的任意位置。

回答时可以举事务的例子：业务方法本身只写转账逻辑，事务开启、提交、回滚这些通用动作由 AOP 在方法调用前后织入，这样业务代码就不需要到处重复写事务控制。 ## 事务

在Spring中，事务是保证一组操作要么全部成功提交到数据库，要么全部失败回滚的机制，用于确保数据的一致性和完整性。例如在银行转账中，从一个账户扣款和向另一个账户存款这两个操作需在一个事务中，保证不会出现扣款成功但存款失败的情况。

### 事务隔离级别

Spring 的事务隔离级别本质上还是使用数据库的隔离能力。DEFAULT 表示沿用数据库默认值；READ\_UNCOMMITTED 隔离性最低，可能出现脏读；READ\_COMMITTED 能避免脏读，但仍可能出现不可重复读；REPEATABLE\_READ 能保证同一事务内多次读取结果一致，是 MySQL InnoDB 的常见默认级别；SERIALIZABLE 隔离性最高，但并发性能也最差。面试时可以顺着说：隔离级别越高，并发能力通常越弱，选择时要在一致性和性能之间取舍。

### 实现事务的方式

Spring 事务有编程式和声明式两类。编程式事务是开发者显式调用事务模板或事务管理器，优点是控制细，缺点是侵入业务代码。声明式事务更常见，典型方式是在方法或类上加 @Transactional，由 Spring AOP 在方法调用前后完成开启事务、提交、异常回滚等操作。

这里容易被追问的是事务失效场景，比如同类内部方法自调用绕过代理、方法不是 public、异常被吞掉没有抛出、回滚异常类型不匹配等。只背 @Transactional 不够，最好能说明它依赖代理机制。

## Spring Boot启动流程

Spring Boot 启动可以从 SpringApplication.run() 讲起。它会先准备环境和配置，再创建 ApplicationContext，随后进行组件扫描、加载 Bean 定义、执行自动配置。@SpringBootApplication 本身组合了 @SpringBootConfiguration、@ComponentScan 和 @EnableAutoConfiguration，其中自动配置会根据 classpath 依赖和配置条件决定是否创建某些 Bean。

如果是 Web 项目，容器初始化过程中还会启动内嵌 Tomcat、Jetty 或 Undertow，注册 Servlet、Filter、Controller 等组件。所有 Bean 创建和初始化完成后，应用才算真正启动完毕，对外监听端口并处理请求。 ## Spring Boot常用注解

1. @SpringBootApplication：标注在主类上，组合了@ComponentScan、@Configuration、@EnableAutoConfiguration，开启组件扫描、配置支持和自动配置功能。
2. @Component：通用的Bean定义注解，被其标注的类会被Spring容器扫描并管理。@Service（业务层 ）、@Repository（数据访问层 ）、@Controller（控制层 ）是其衍生注解，功能类似，用于更明确分层。
3. @Autowired：按类型自动注入依赖的Bean，可用于成员变量、方法、构造函数。也可搭配@Qualifier按名称注入。
4. @Resource：按名称装配Bean，是J2EE注解，与@Autowired区别在于匹配方式，@Resource默认按名称，@Autowired默认按类型。
5. @Configuration：标注配置类，等价于传统Spring的XML配置文件，常与@Bean搭配，用@Bean注解方法来定义Bean。
6. @Bean：在@Configuration类的方法上使用，声明该方法返回的对象是一个Bean，由Spring容器管理。
7. @Scope：定义Bean的作用域，如singleton（单例，默认 ）、prototype（多例 ）、request（一次HTTP请求内有效，Web 应用 ）、session（一个用户会话内有效，Web 应用 ）等 。
8. @Value：从配置文件读取值注入到变量。
9. @ConfigurationProperties：将配置文件属性批量绑定到对象。
10. @ConditionalOnProperty：基于配置属性条件装配Bean，满足指定属性条件才创建Bean。 # MySQL

MySQL 部分是 Java 后端面试的高频区，央国企技术岗尤其喜欢追问事务、索引、日志和锁。准备时不要只背“B+ 树更适合范围查询”，还要能说明索引如何影响查询路径、事务如何保证一致性、日志如何支撑崩溃恢复，以及锁为什么会影响并发性能。

## MySQL基础

### **数据库三大范式了解吗?**

- **1NF：属性不可再分** 属性（表中的字段）不可再分割，如地址：xxx省xxx市xxx县就不满足1NF的要求，因为可以再细分为省、市、县三个属性。
- **2NF：消除部分依赖** 假设我们有一个存储员工信息的表，员工ID、姓名、部门、部门ID等，由于部门名称依赖于部门ID而不是整个员工ID，部门名称就部分依赖于部门ID。

| 员工ID（主键） | 姓名 | 部门ID（候选键） | 部门名称 |
| --- | --- | --- | --- |
| 1 | 张三 | 101 | 研发部 |
| 2 | 李四 | 102 | 销售部 |
| 3 | 王五 | 101 | 研发部 |

如果按 2NF 对原始表进行分解，就需要将部门名称从员工信息表中移出，单独创建部门表来维护部门 ID 和部门名称的对应关系，从而消除部分依赖。

**员工信息表（Employee）：**
| 员工ID（主键） | 姓名 | 部门ID（候选键） |
| --- | --- | --- |
| 1 | 张三 | 101 |
| 2 | 李四 | 102 |
| 3 | 王五 | 101 |

**部门信息表（Department）：**
| 部门ID（主键） | 部门名称 |
| --- | --- |
| 101 | 研发部 |
| 102 | 销售部 |

在这种设计下，部门名称被移至独立的部门信息表中，而员工信息表中的部门ID则作为外键，与部门信息表中的部门ID形成关联。这样，部门名称就不再部分依赖于员工信息表中的任何属性，满足了2NF的要求。

- **3NF：消除传递依赖** 我们通过一个例子来解释第三范式（3NF）。假设我们有一个订单表，其中包含订单号（OrderID）、客户姓名（CustomerName）、客户地址（CustomerAddress）、产品ID（ProductID）、产品名称（ProductName）、产品价格（ProductPrice）等字段，初始的订单表如下所示：

| OrderID | CustomerName | CustomerAddress | ProductID | ProductName | ProductPrice |
| --- | --- | --- | --- | --- | --- |
| 1 | Alice | 123 Main St | 101 | Laptop | 1000 |
| 2 | Bob | 456 Oak St | 102 | Smartphone | 800 |
| 3 | Alice | 123 Main St | 103 | Tablet | 500 |

在这个表中，我们可以看到以下几点：

1. **候选键**：候选键是能够唯一标识元组的属性集合。在这个表中，候选键可以是（OrderID）或者（OrderID, ProductID），因为它们能够唯一标识订单。我们选用（OrderID）作为候选键。
2. **传递依赖**：传递依赖是指非主属性之间存在依赖关系，并且这种依赖是通过其他非主属性传递的。在这个表中，ProductName 和 ProductPrice 依赖于 ProductID，而 ProductID 又依赖于 OrderID。这就构成了一个传递依赖关系。

为了让表结构符合第三范式，需要将存在传递依赖的属性移出原始表，单独创建新的表来存储这些属性。这里可以将产品信息从订单表中拆出，形成独立的产品表，这样订单表就不再存在上述传递依赖。修改后的表设计如下：

**订单表（Orders）：**
| OrderID | CustomerName | CustomerAddress |
| --- | --- | --- |
| 1 | Alice | 123 Main St |
| 2 | Bob | 456 Oak St |
| 3 | Alice | 123 Main St |

**产品表（Products）：**
| ProductID | ProductName | ProductPrice |
| --- | --- | --- |
| 101 | Laptop | 1000 |
| 102 | Smartphone | 800 |
| 103 | Tablet | 500 |

通过这种设计，订单表不再存在传递依赖，每个非主属性直接依赖于候选键（OrderID），同时也避免了数据冗余和不一致性问题，符合第三范式的要求。

### **NULL 和 ’’ 的区别是什么？**

1、NULL代表一个不确定的值，即使是2个NULL也不会相等，例如：SELECT NULL=NULL的结果为 false，但是在我们使用DISTINCT,GROUP BY,ORDER BY时,NULL又被认为是相等的。

2、’’的长度为0，而NULL是需要占存储空间的

3、NULL 会影响聚合函数的结果。例如，SUM、AVG、MIN、MAX 等聚合函数会忽略 NULL 值。 COUNT 的处理方式取决于参数的类型。如果参数是 _(COUNT(_))，则会统计所有的记录数，包括 NULL 值；如果参数是某个字段名(COUNT(列名))，则会忽略 NULL 值，只统计非空值的个数。

4、查询 NULL 值时，必须使用 IS NULL 或 IS NOT NULLl 来判断，而不能使用 =、!=、 之类的比较运算符。而’’是可以使用这些比较运算符的。

### **MyISAM 和 InnoDB 有什么区别？**

- 是否支持行锁：MyISAM只支持表锁，而InnoDB支持行锁，默认为行锁。
- 是否支持事务：MyISAM不支持事务，而InnoDB支持事务，默认的事务隔离级别为可重复读。
- 是否支持外键：MyISAM不支持外键，而InnoDB支持外键，会对性能有一定损耗，并且代码规范不允许使用外键。
- 是否支持安全恢复：MyISAM不支持，InnoDB在数据库异常崩溃之后，数据库重新启动的时候会恢复到崩溃前的状态（依赖RedoLog）。
- 是否支持MVCC：MyISAM不支持，InnoDB支持MVCC。
- 索引实现不一样：两者都是B+Tree作为索引，但是实现方式不太一样。InnoDB中数据文件本身就是索引文件，而MyISAM索引文件和数据文件是分离的。 ## **索引相关**

### **说说索引的优缺点？**

索引的存在就像字典里面的目录一样，可以帮帮助我们快速查找到记录的位置。

优点：

- 加快检索速度：如果将磁盘IO比作查字典时的翻页操作的话，那么有了索引能够显著降低我们的磁盘IO次数，提升查找效率。
- 保证数据唯一性：通过创建唯一索引，可以保障数据库表中每一行数据的唯一性。 缺点：
- 维护索引开销：和字典里面的目录不一样，索引的底层是B+树，是需要根据记录的插入、删除等操作不断进行维护的。维护索引本身会带来开销，同时当索引太大的时候，维护成本变得很高会降低记录的增、删效率。
- 占用物理内存：和字典的目录页一样，索引本身会占有一定的物理内存。 总之，多数情况下索引查找会比全表扫描更快，但是当数据量非常小的时候索引查找也不一定会比全表扫描更快。

### **MySQL为什么采用B+树而非Hash表来作为索引？**

其实字典目录的索引结构更像是Hash表，只需要拼音和页码就可以查询到想要的数据，整个查询的时间复杂度为O(1)非常高效。而MySQL的数据库的索引则是B+树构成的，查询的效率稍慢一些，跟B+树的深度有关。那么既然Hash表查询这么高效，为什么MySQL不采用Hash表来作为索引呢？其实主要是因为Hash索引不支持**顺序查找** 和 **范围查找** ，举个栗子：

select \* from tb1 where id 、=、<=、BETWEEN、like前缀匹配的范围查询，并不会停止匹配。

所以，在使用联合索引的时候，可以将区分度高的字段放在最左侧，也可以过滤更多数据。

#### **回表**

回表是指MySQL在执行查询过程中使用了“索引覆盖”（Covering Index），但是索引中并未包含SQL所需要查询的全部数据。

还需要根据主键ID回到“主键索引”或“聚集索引”中去查询到全部数据，这样会带来额外的性能开销。

### **索引使用原则**

#### **选择合适的字段创建索引**

- **为NULL的字段不能作为索引：** 数据引擎的索引中大多数都不会包含NULL值，因为在B+树结构中NULL值常常难以被有效的排序和对比。而对于为NULL的字段数据引擎处理方式通常也有所不同，有的会进行单独存储，有的则不会。
- **频繁查询的字段应该建立索引：** 被频繁查询的数据如果不走索引则会频繁的进行全表扫描，严重的降低数据库的查询效率。
- **被作为条件查询的字段应当建立索引：** 被作为Where条件查询的数据应该建立其索引，这样能够增加查询效率。
- **频繁需要被排序的字段应该建立索引：** B+树本身就是排序树，因此对于频繁需要被排序的字段建立索引之后，能够有效利用B+树有序这一特点。
- **频繁用于连接的字段应当建立索引：** 经常用于连接的字段可能是一些外键列，对于外键列并不一定要建立外键，只是说该列涉及到表与表的关系。对于频繁被连接查询的字段，可以考虑建立索引，提高多表连接查询的效率。 #### **频繁被更新的字段建立索引应当慎重**

虽然索引能带来查询上的效率，但是维护索引的成本也是不小的。 如果一个字段不被经常查询，反而被经常修改，那么就更不应该在这种字段上建立索引了。

#### **限制单张表上的索引数量**

单张表的索引数量最好不要超过5个，虽然索引可以提高查询性能，但索引本身也需要额外的存储空间和维护成本，过多的索引可能会导致以下问题：

1. **存储空间占用**: 每个索引都需要额外的存储空间，包括索引键和指针。如果表上有太多的索引，将会增加数据库的存储需求。
2. **写操作的性能**: 当进行插入、更新或删除等写操作时，数据库不仅需要更新数据表，还需要更新索引。如果有太多的索引，这些操作会变得更加耗时，因为每个操作都需要更新多个索引。
3. **查询性能下降**: 尽管索引可以加快查询速度，但查询性能也会受到索引数量的影响。过多的索引可能会增加查询优化器的选择空间，导致它难以选择最有效的索引，从而降低查询性能。
4. **维护成本增加**: 索引的存在意味着数据库需要额外的维护工作，例如索引的重新组织、重建和统计信息的更新等。索引数量过多会增加这些维护操作的成本。

#### **尽量建立联合索引而非单列索引**

因为索引是需要占用磁盘空间的，可以简单理解为每个索引都对应着一颗 B+树。如果一个表的字段过多，索引过多，那么当这个表的数据达到一个体量后，索引占用的空间也是很多的，且修改索引时，耗费的时间也是较多的。如果是联合索引，多个字段在一个索引上，那么将会节约很大磁盘空间，且修改数据的操作效率也会提升。

#### **要避免冗余的索引**

冗余索引指的是索引的功能相同，能够命中索引(a, b)就肯定能命中索引(a) ，那么索引(a)就是冗余索引。如（name,city ）和（name ）这两个索引就是冗余索引，能够命中前者的查询肯定是能够命中后者的 在大多数情况下，都应该尽量扩展已有的索引而不是创建新索引。

#### **避免索引失效**

- 使用 SELECT \* 进行查询; SELECT \* 不会直接导致索引失效（如果不走索引大概率是因为 where 查询范围过大导致的），但它可能会带来一些其他的性能问题比如造成网络传输和数据处理的浪费、无法使用索引覆盖;
- 创建了组合索引，但查询条件未遵守最左匹配原则;
- 在索引列上进行计算、函数、类型转换等操作;
- 以 % 开头的 LIKE 查询比如 LIKE ‘%abc’;
- 查询条件中使用 OR，且 OR 的前后条件中有一个列没有索引，涉及的索引都不会被使用到;
- IN 的取值范围较大时会导致索引失效，走全表扫描(NOT IN 和 IN 的失效场景相同);
- 发生隐式转换open in new window; ## **MySQL日志相关**

### **MySQL 中常见的日志有哪些？**

![images/board-VDvGwOpCyhT5IZbR41bcmQC6nFg.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/5be84d3263164332b2dd709629fd3cb0.png)

images/board-VDvGwOpCyhT5IZbR41bcmQC6nFg.png

MySQL 中常见的日志类型主要有下面几类（针对的是 InnoDB 存储引擎）：

**错误日志（error log） ：**对 MySQL 的启动、运行、关闭过程进行了记录。

**二进制日志（binary log） ：**主要记录的是更改数据库数据的 SQL 语句。

**一般查询日志（general query log） ：**已建立连接的客户端发送给 MySQL 服务器的所有 SQL 记

录，因为 SQL 的量比较大，默认是不开启的，也不建议开启。

**慢查询日志（slow query log） ：**执行时间超过 long\_query\_time秒钟的查询，解决 SQL 慢查询

问题的时候会用到。

**事务日志(redo log 和 undo log) ：**redo log 是重做日志，undo log 是回滚日志。

**中继日志(relay log) ：**relay log 是复制过程中产生的日志，很多方面都跟 binary log 差不多。不

过，relay log 针对的是主从复制中的从库。

**DDL 日志(metadata log) ：**DDL 语句执行的元数据操作。

二进制日志 binlog （归档日志）和事务日志(redo log 和 undo log)比较重要，需要我们重点关注。

### **慢查询日志有什么用？**

慢查询日志记录了执行时间超过 long\_query\_time（默认是 10s）的所有查询，在我们解决 SQL 慢查询

（SQL 执行时间过长）问题的时候经常会用到。

慢查询日志默认是关闭的，我们可以通过下面的命令将其开启： long\_query\_time 参数定义了一个查询消耗多长时间才可以被定义为慢查询，默认是 10s，通过以下命令即可查看：

SHOW VARIABLES LIKE '%long\_query\_time%' 
SET GLOBAL slow\_query\_log=ON

并且，我们还可以对 long\_query\_time 参数进行修,在实际项目中，慢查询日志可能会比较大，直接分析的话不太方便，我们可以借助 MySQL 官方的慢查,询分析调优工具 mysqldumpslow。

### **binlog 主要记录了什么？**

MySQL binlog(binary log 即二进制日志文件) 主要记录了 MySQL 数据库中数据的所有变化(数据库执行

的所有 DDL 和 DML 语句)。 binlog 有一个比较常见的应用场景就是主从复制，MySQL 主从复制依赖于 binlog 。另外，常见的一些

同步 MySQL 数据到其他数据源的工具（比如 canal）的底层一般也是依赖 binlog 。 binlog 通过追加的方式进行写入，大小没有限制。并且，我们可以通过max\_binlog\_size参数设置每个 binlog 文件的最大容量，当文件大小达到给定值之后，会生成新的 binlog 文件来保存日志，不会出现前

面写的日志被覆盖的情况。

### **页修改之后为什么不直接刷盘呢？**

很多人可能要问了：为什么每次修改 Buffer Pool 中的页之后不直接刷盘呢？这样不就不需要 redo log

了嘛！

这种方式必然是不行的，性能非常差。最大的问题就是 InnoDB 页的大小一般为 16KB，而页又是磁盘

和内存交互的基本单位。这就导致即使我们只修改了页中的几个字节数据，一次刷盘操作也需要将

16KB 大小的页整个都刷新到磁盘中。而且，这些修改的页可能并不相邻，也就是说这还是随机 IO。

采用 redo log 的方式就可以避免这种性能问题，因为 redo log 的刷盘性能很好。首先，redo log 的写

入属于顺序 IO。 其次，一行 redo log 记录只占几十个字节。

另外，Buffer Pool 中的页（脏页）在某些情况下（比如 redo log 快写满了）也会进行刷盘操作。不

过，这里的刷盘操作会合并写入，更高效地顺序写入到磁盘。

### **binlog 和 redolog 有什么区别？**

binlog 主要用于数据库还原，属于数据级别的数据恢复，主从复制是 binlog 最常见的一个应用场

景。redolog 主要用于保证事务的持久性，属于事务级别的数据恢复。

redolog 属于 InnoDB 引擎特有的，binlog 属于所有存储引擎共有的，因为 binlog 是 MySQL 的

Server 层实现的。

redolog 属于物理日志，主要记录的是某个页的修改。binlog 属于逻辑日志，主要记录的是数据库

执行的所有 DDL 和 DML 语句。

binlog 通过追加的方式进行写入，大小没有限制。redo log 采用循环写的方式进行写入，大小固

定，当写到结尾时，会回到开头循环写日志。

## **MySQL事务相关**

### **什么是事务**

我们设想一个场景，这个场景中我们需要插入多条相关联的数据到数据库，不幸的是，这个过程可能会遇到下面这些问题：

- 数据库中途突然因为某些原因挂掉了。
- 客户端突然因为网络原因连接不上数据库了。
- 并发访问数据库时，多个线程同时写入数据库，覆盖了彼此的更改。
- …… 上面的任何一个问题都可能会导致数据的不一致性。为了保证数据的一致性，系统必须能够处理这些问题。事务就是我们抽象出来简化这些问题的首选机制。事务的概念起源于数据库，目前，已经成为一个比较广泛的概念。

**何为事务？** 一言蔽之，**事务是逻辑上的一组操作，要么都执行，要么都不执行。**

事务最经典也经常被拿出来说例子就是转账了。假如小明要给小红转账 1000 元，这个转账会涉及到两个关键操作，这两个操作必须都成功或者都失败。

1. 将小明的余额减少 1000 元
2. 将小红的余额增加 1000 元。 事务会把这两个操作就可以看成逻辑上的一个整体，这个整体包含的操作要么都成功，要么都要失败。这样就不会出现小明余额减少而小红的余额却并没有增加的情况。

![images/HgWybyAmyorm9YxRDXmcORu5nyb.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/dcd970e465914c8fb657818ee2486357.png)

images/HgWybyAmyorm9YxRDXmcORu5nyb.png

### 事务的4大特性

**原子性（Atomicity）**

现实世界中转账操作是一个不可分割的操作，也就是说要么压根儿就没转，要么转账成功，不能存在中间的状态，也就是转了一半的这种情况。设计数据库的大叔们把这种要么全做，要么全不做的规则称之为原子性。但是在现实世界中的一个不可分割的操作却可能对应着数据库世界若干条不同的操作，数据库中的一条操作也可能被分解成若干个步骤（比如先修改缓存页，之后再刷新到磁盘等），最要命的是在任何一个可能的时间都可能发生意想不到的错误（可能是数据库本身的错误，或者是操作系统错误，甚至是直接断电之类的）而使操作执行不下去。

**隔离性（Isolation）**

现实世界中的两次状态转换应该是互不影响的，比如说用户A向用户B同时进行的两次金额为5元的转账（假设可以在两个ATM机上同时操作）。那么最后用户A的账户里肯定会少10元，用户B的账户里肯定多了10元。隔离性是指事务在执行过程中，不会受到其他事务的影响，每个事务都好像在独立的环境中运行一样。这确保了事务之间的独立性和透明性。

**一致性（Consistency）**

一致性是指事务执行前后，数据库的状态必须符合预定的规则，即事务必须使数据库从一个一致状态转换到另一个一致状态。这些规则包括数据完整性约束、外键约束等。

**持久性（Durability）**

当现实世界的一个状态转换完成后，这个转换的结果将永久的保留，这个规则被设计数据库的大叔们称为持久性。比方说用户A向用户B转账，当ATM机提示转账成功了，就意味着这次账户的状态转换完成了，用户A就可以拔卡走人了。如果当用户A走掉之后，银行又把这次转账操作给撤销掉，恢复到没转账之前的样子，那用户B不就惨了，又得被砍死了，所以这个持久性是非常重要的。当把现实世界的状态转换映射到数据库世界时，持久性意味着该转换对应的数据库操作所修改的数据都应该在磁盘上保留下来，不论之后发生了什么事故，本次转换造成的影响都不应该被丢失掉（要不然用户B还是会被砍死）。

### 事务并发环境运行存在的问题

事务在并发环境下，最容易出现的3个问题就是脏读、不可重复读和幻读，这里用最简单的例子来解释什么是脏读、幻读和不可重复读。

#### 脏读：一个事务读取到了另一个事务未提交的数据

![images/board-MYwQwHcSKhZYgebw3iEcYwiKn2g.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/599b502b5b4840169fe443c3916aae0a.png)

images/board-MYwQwHcSKhZYgebw3iEcYwiKn2g.png

[脏读](https://www.baidu.com/s?rsv_idx=1&wd=%E8%84%8F%E8%AF%BB&fenlei=256&usm=1&ie=utf-8&rsv_pq=a40505a80005b733&oq=%E8%84%8F%E8%AF%BB&rsv_t=0440X5YQwQVifNJqf88SbOm02NKnsWPA5L5qDv%2BJiP8KAFjZD9CRxz6Cbto&sa=re_dqa_generate)（Dirty Read）是指在[数据库管理](https://www.baidu.com/s?rsv_idx=1&wd=%E6%95%B0%E6%8D%AE%E5%BA%93%E7%AE%A1%E7%90%86&fenlei=256&usm=1&ie=utf-8&rsv_pq=a40505a80005b733&oq=%E8%84%8F%E8%AF%BB&rsv_t=89ceizhu%2FTXCXLZajyt%2BpG9nfKjki%2FNuZup7kBrDe5oHrSaFBrgQ27syins&sa=re_dqa_generate)中，一个事务读取了另一个事务未提交的数据。 这种情况会导致数据的不一致性，因为被读取的数据可能最终会被回滚。脏读主要发生在更新操作中，当一个事务正在访问数据并对其进行修改，而另一个事务也访问这些数据时，可能会导致基于未提交数据的操作不正确。

1. **脏读的影响** 脏读会导致数据的不一致性，因为被读取的数据可能最终会被回滚。例如，事务T1修改了某个值，事务T2读取了这个值，然后T1因为某种原因撤销了对该值的修改，这时T2读取到的数据就是无效的。这种情况会导致基于脏数据所做的操作可能是不正确的。
2. **避免脏读的方法** 为了避免脏读，可以采取以下措施：

- 使用事务隔离级别：将事务的隔离级别设置为可重复读（Repeatable Read）或更高，这样可以防止一个事务中的更改影响到另一个事务的读取操作。
- 锁定机制：在读取数据时加锁，确保在数据提交之前，其他事务不能读取该数据。
- 优化事务设计：合理安排事务的执行顺序和时间，减少并发冲突的可能性。 #### 不可重复读：一个事务在两次读取同一数据时，由于其他事务的修改，导致两次读取的结果不同。

![images/board-QlgLwYtFoha0HKbsPI2c1Z1mn2b.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/aadc6fbbf40041508f6624356c0f4b74.png)

images/board-QlgLwYtFoha0HKbsPI2c1Z1mn2b.png

[不可重复读](https://www.baidu.com/s?rsv_idx=1&wd=%E4%B8%8D%E5%8F%AF%E9%87%8D%E5%A4%8D%E8%AF%BB&fenlei=256&usm=1&ie=utf-8&rsv_pq=9187aaad00744882&oq=%E4%B8%8D%E5%8F%AF%E9%87%8D%E5%A4%8D%E8%AF%BB&rsv_t=b8c4WQkddD0tSQ8HeXjpLR4i4PrqN1QHWSC%2B4iM2f%2FLbn4uEqDICij36sFE&sa=re_dqa_generate)（Non-repeatable Read）是指在一个事务内，多次读取同一数据时，由于其他事务的修改，导致第一次和第二次读取的数据不一致。这种情况发生在同一个事务中，对同一批数据的多次读取结果不同。

**产生原因**

不可重复读的主要原因是其他事务在第一个事务的读取过程中对数据进行了修改并提交。例如，事务A多次读取同一数据，而事务B在事务A多次读取的过程中修改了该数据并提交，导致事务A多次读取的结果不一致。

**解决办法**

为了解决不可重复读问题，可以使用更严格的隔离级别，如可串行化隔离级别，或者使用行级锁或多版本并发控制（[MVCC](https://www.baidu.com/s?rsv_idx=1&wd=MVCC&fenlei=256&usm=1&ie=utf-8&rsv_pq=9187aaad00744882&oq=%E4%B8%8D%E5%8F%AF%E9%87%8D%E5%A4%8D%E8%AF%BB&rsv_t=4aaetibS4TCWiMof%2B%2FliPMi7FMBYnmendeaOxrs5cV7QZQKS%2F9PZyQb2t4k&sa=re_dqa_generate)）。这些方法可以确保在一个事务执行过程中，其他事务的修改不会影响到该事务的读取结果。

#### 幻读：一个事务在两次查询相同条件的数据时，由于其他事务的插入操作，导致第二次查询多出了一些记录。

[幻读](https://www.baidu.com/s?rsv_idx=1&wd=%E5%B9%BB%E8%AF%BB&fenlei=256&usm=3&ie=utf-8&rsv_pq=a6214c88004b42c2&oq=%E5%B9%BB%E8%AF%BB&rsv_t=794b2IYQzjS2yOAnk%2BMbHueXCB5cfZuxnb37JlsLGmygadzgpTF9E6zX%2Fao&sa=re_dqa_generate)（Phantom Read）是指当事务不是独立执行时发生的一种现象。 具体来说，当一个事务在读取某个范围内的记录时，另一个事务又在该范围内插入了新的记录，当第一个事务再次读取该范围时，会发现有“幻影”数据出现，仿佛第一次读取时这些数据就不存在。12

**产生原因**

幻读的产生通常是因为多个事务在并发执行时，对同一数据集进行操作。例如，事务A读取了某个范围内的数据，事务B在这个范围内插入了新的数据，当事务A再次读取时，会发现有新的数据出现，仿佛第一次读取时这些数据就不存在一样。

**解决方法和影响**

解决幻读的方法通常是通过增加范围锁（Range Locks），这样可以避免事务在读取数据时出现幻读现象。在数据库的隔离级别中，最高级别的[SERIALIZABLE](https://www.baidu.com/s?rsv_idx=1&wd=SERIALIZABLE&fenlei=256&usm=3&ie=utf-8&rsv_pq=a6214c88004b42c2&oq=%E5%B9%BB%E8%AF%BB&rsv_t=c040N7bR3Lk3fYtfkwlz2jt8zBG%2FgTKqMCJJ%2FGZEF9ANZevXBoWNytzV7Ro&sa=re_dqa_generate)可以保证不出现幻读问题。Repeatable Read (RR) 隔离级别通过加锁机制保证读取的数据在事务内是一致的，从而避免幻读。

#### MySQL 中四种事务隔离级别

我们上边所说的舍弃一部分隔离性来换取一部分性能在这里就体现在：设立一些隔离级别，隔离级别越低，越严重的问题就越可能发生。有一帮人（并不是设计MySQL的大叔们）制定了一个所谓的SQL标准，在标准中设立了4个隔离级别：

- READ UNCOMMITTED：读未提交。
- READ COMMITTED：读已提交。
- REPEATABLE READ：可重复读。
- SERIALIZABLE：可串行化。 SQL标准中规定，针对不同的隔离级别，并发事务可以发生不同严重程度的问题，具体情况如下：

也就是说：

- READ UNCOMMITTED（读未提交）隔离级别下，可能发生脏读、不可重复读和幻读问题。
- READ COMMITTED隔离级别下，可能发生不可重复读和幻读问题，但是不可以发生脏读问题。
- REPEATABLE READ隔离级别下，可能发生幻读问题，但是不可以发生脏读和不可重复读的问题。
- SERIALIZABLE隔离级别下，各种问题都不可以发生。 ## MySQL锁

### 表级锁和行级锁了解吗？有什么区别？

MyISAM 仅支持表级锁（table-level locking），一旦加锁就会锁住整张表，在并发写场景下性能较差。InnoDB 不仅支持表级锁，也支持行级锁（row-level locking），默认使用行级锁。

行级锁的粒度更小，仅对相关的记录上锁即可（对一行或者多行记录加锁），所以对于并发写入操作来说， InnoDB 的性能更高。

- **表级锁：** MySQL 中锁定粒度最大的一种锁（全局锁除外），是针对非索引字段加的锁，对当前操作的整张表加锁，实现简单，资源消耗也比较少，加锁快，不会出现死锁。不过，触发锁冲突的概率最高，高并发下效率极低。表级锁和存储引擎无关，MyISAM 和 InnoDB 引擎都支持表级锁。
- **行级锁：** MySQL 中锁定粒度最小的一种锁，是 **针对索引字段加的锁** ，只针对当前操作的行记录进行加锁。 行级锁能大大减少数据库操作的冲突。其加锁粒度最小，并发度高，但加锁的开销也最大，加锁慢，会出现死锁。行级锁和存储引擎有关，是在存储引擎层面实现的。 ### 行级锁的使用有什么注意事项？

InnoDB 的行锁是针对索引记录加的锁。执行 UPDATE、DELETE 语句时，如果 WHERE 条件没有命中合适索引，或者索引失效，就可能退化为扫描大量记录并加锁，导致锁范围扩大、并发性能下降。实际开发中要重点关注这一点。

另外，即使 SQL 写到了索引字段，也不代表一定会走索引。MySQL 优化器会根据统计信息、过滤性和成本估算选择执行计划，因此仍然需要通过 EXPLAIN 验证。

### InnoDB 有哪几类行锁？

InnoDB 行锁是通过对索引数据页上的记录加锁实现的，MySQL InnoDB 支持三种行锁定方式：

- **记录锁（Record Lock）**：也被称为记录锁，属于单个行记录上的锁。
- **间隙锁（Gap Lock）**：锁定一个范围，不包括记录本身。
- **临键锁（Next-Key Lock）**：Record Lock+Gap Lock，锁定一个范围，包含记录本身，主要目的是为了解决幻读问题（MySQL 事务部分提到过）。记录锁只能锁住已经存在的记录，为了避免插入新记录，需要依赖间隙锁。 在 InnoDB 默认的隔离级别 REPEATABLE-READ 下，行锁默认使用的是 Next-Key Lock。但是，如果操作的索引是唯一索引或主键，InnoDB 会对 Next-Key Lock 进行优化，将其降级为 Record Lock，即仅锁住索引本身，而不是范围。

# Redis

Redis 在 Java 后端面试中通常围绕缓存、分布式锁、排行榜、计数器、消息队列和高可用展开。央国企项目更关注稳定性和可控性，所以回答 Redis 时要同时说清“为什么快、用在哪里、数据丢不丢、缓存异常怎么处理、集群如何保证可用”。

## Redis基础

### 你们项目中的Redis一般运用在什么场景中？有什么作用？

项目里用 Redis，最常见的作用是把“读多、变化不频繁、访问链路比较重”的数据放到内存里，减少数据库压力。比如商品详情、文章详情、配置项、复杂统计结果，都可以在短时间内缓存起来。这样请求再次进来时，不必每次都走数据库和复杂计算，接口响应会更稳定。

第二类场景是状态和临时数据。用户登录态、验证码、短期 token、接口限流计数，都适合放在 Redis 里，因为 Redis 支持过期时间，也支持原子自增这类操作。比如做登录会话时，可以把用户 ID、权限标识和过期时间放进 Redis；做访问次数统计时，可以用 INCR 配合过期时间控制窗口。

第三类是利用 Redis 的数据结构解决具体业务问题。List 可以做简单队列，Set 可以做去重，ZSet 可以做排行榜，Bitmap 可以做签到或在线状态，Pub/Sub 可以做轻量事件通知。不过面试里要注意边界：Redis 可以做轻量消息队列，但如果需要可靠投递、消费确认、重试和堆积治理，通常还是要用 Kafka、RocketMQ 这类专业消息队列。

### Redis为什么这么快？

Redis 快，首先是因为主要数据在内存里，访问延迟远低于磁盘数据库。其次，Redis 的数据结构做了很多针对性优化，例如 String、Hash、List、Set、ZSet 会根据数据规模选择不同底层编码，尽量兼顾速度和空间。再往下看，Redis 用 IO 多路复用和事件驱动模型处理大量连接，不需要为每个连接单独创建线程，减少了线程切换成本。

面试里还可以补一句：Redis 的“单线程”主要指命令执行的主流程单线程，这让它避免了复杂锁竞争；但 Redis 并不是所有工作都只有一个线程，后台持久化、异步删除、网络 IO 等在不同版本中会有相应优化。不要把“单线程”简单理解成“功能上完全没有多线程”。

### Redis有哪些数据结构？其实现原理是怎样的？

![images/board-PUfdwEuA5hGGllb1JoOc10Alnyb.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/204729318b3b4cbf9d8057934af01436.png)

images/board-PUfdwEuA5hGGllb1JoOc10Alnyb.png

Redis 的基础结构可以按使用场景理解。String 是最基础的 key-value，底层使用 SDS，既能存普通字符串，也能存整数、二进制数据，常用于缓存、计数、分布式锁的 value。Hash 适合存对象，比如用户信息、商品摘要；当字段较多但又不想把整个对象序列化成一个大字符串时，Hash 会更方便。

List 保留插入顺序，适合做简单队列或栈；Set 无序且去重，适合标签、关注关系、去重集合，也支持交并差运算；ZSet 在 Set 的基础上给每个成员加了 score，适合排行榜、延迟队列、按分数范围查询。回答时不用把每个命令都背出来，重点是能把数据结构和业务场景对应起来。

![images/board-JuojwyShnhougjbYmNFc6kTxnDe.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/a32ffc8d40d9460eaf0d03c2e93d5d75.png)

images/board-JuojwyShnhougjbYmNFc6kTxnDe.png

特殊结构里，Bitmap 适合用 bit 位表示状态，比如签到、在线状态、用户行为标记；HyperLogLog 用极小内存估算 UV、独立 IP 这类基数，但结果是近似值；Geo 则用于附近的人、附近门店这类地理位置查询。它们的共同点是解决特定问题时非常省空间，但不一定适合替代通用数据结构。 ### Redis宕机数据会丢失吗？

![images/board-YKZtwlbDIhPi6WbI0bcchE7nn8b.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/764b9573923e4e5d9aa099f72f3d1f00.png)

images/board-YKZtwlbDIhPi6WbI0bcchE7nn8b.png

如果Redis没有开启任何的持久化机制，那么数据就会全部丢失，否则只会丢失部分数据，丢失数据的多少取决于采用的持久化配置。

Redis提供了两套持久化机制，RDB和AOF：

RDB会根据设置的情况定期去fork一个子进程，生成当前时间节点数据库的全量快照。如果在RDB快照完成之后出现宕机，那么会丢失掉快照生成期间的全部增量数据，如果在快照还没生成成功的时候宕机，则会丢失掉所有的数据。

AOF则会将每次执行的Redis命令追加到日志文件当中，然后恢复的时候根据日志文件中的指令记录来进行数据的恢复。但是AOF每次命令执行完毕之后数据会先被写入AOF缓存，再写入操作系统缓存，因此刷盘策略决定了Redis宕机的时候会丢失多少数据。

- Always：每执行一条指令就刷盘一次，最多会丢失一条指令
- Eversec：每分钟刷盘一次，宕机时最多丢失1s内的数据。
- No：不主动刷盘，由操作系统自己决定，宕机时最多丢失从上一次刷盘到本次刷盘的所有数据 ### Redis 的AOF机制是怎么实现的？

![images/board-Bnx8w7oZIhByvLbgV6zcybYDnZz.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/72ee03b7a5f04f738d4346e447dbaf9e.png)

images/board-Bnx8w7oZIhByvLbgV6zcybYDnZz.png

AOF（Append Only File）是通过追加写命令来做持久化。Redis 每执行一条写命令，就把这条命令追加到 AOF 文件中；重启恢复时，再按顺序重放这些命令。它的优点是数据丢失窗口可以比较小，尤其是配置为每秒刷盘时，通常最多丢失 1 秒左右的数据。

AOF 文件会随着写入不断变大，所以 Redis 会做 AOF 重写。重写不是简单复制旧日志，而是根据当前内存数据生成一份更紧凑的新 AOF 文件。例如一个 key 被反复修改很多次，重写后只需要保留能恢复当前状态的最终命令。重写期间主进程继续处理请求，新写入会进入缓冲区，最后再合并到新文件里。

### Redis 的RDB机制是怎么实现的？

![images/board-UTSfw9yAwhF8jeb6h8acLVMenhe.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/d8087b6b3de44c8fbab1816664a50b09.png)

images/board-UTSfw9yAwhF8jeb6h8acLVMenhe.png

RDB（Redis DataBase）是快照持久化，它保存的是某一时刻 Redis 内存数据的整体状态。触发方式可以是手动执行 SAVE / BGSAVE，也可以通过配置文件中的 save 条件自动触发。实际使用中更常见的是 BGSAVE，因为它会 fork 子进程生成快照，主进程可以继续处理请求。

RDB 的优点是文件紧凑、恢复速度快，也适合做全量备份；缺点是两次快照之间的数据如果还没来得及落盘，宕机后就可能丢失。因此，RDB 更适合对恢复速度和备份友好性要求高的场景；如果业务更看重尽量少丢数据，通常会结合 AOF 一起使用。

### Redis常用内存淘汰策略？

![images/KX4GbPebUoLe3kxnqT5cCd42nBe.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/ea788ff874924118a0139f80c458424b.png)

images/KX4GbPebUoLe3kxnqT5cCd42nBe.png

从淘汰范围来说可以分为不淘汰任何数据、只从设置了到期时间的键中淘汰和从所有键中淘汰三类。而从淘汰算法来分，又主要分为 random（随机），LRU（最近最少使用），以及 LFU（最近最不常使用）三种。

### 什么是布隆过滤器？

布隆过滤器用来快速判断一个元素“可能存在”或“一定不存在”。它底层是位数组 + 多个哈希函数，插入元素时会把多个哈希位置置为 1；查询时如果有任意一个位置不是 1，就能确定这个元素一定不存在。

它的优点是非常省内存，适合挡掉大量无效请求。缺点是有误判：判断存在时不一定真的存在，只能说“可能存在”；判断不存在时才是确定的。另外普通布隆过滤器也不太适合删除元素，因为多个元素可能共享同一批 bit 位。

所以它常用在缓存穿透场景里：请求进来先过布隆过滤器，如果判断一定不存在，就没必要再打 Redis 和数据库。

## Redis集群相关

### Redis 是如何实现高可用的？

Redis 高可用最基础的是主从复制。一般是一个主节点负责写，从节点复制主节点的数据，并承担一部分读请求。简单说就是：写走主节点，主节点再把写操作同步给从节点。这样既能做读写分离，也能在主节点故障时为故障转移打基础。

### Redis哨兵模式？

只有主从复制还不够，因为主节点挂了以后，如果全靠人工切换，恢复速度太慢。哨兵模式就是为了解决这个问题。Sentinel 会持续监控主从节点的状态。一旦判断主节点不可用，就会从从节点里选一个新的主节点，并通知其他节点切换过去。哨兵可以理解成一组“观察者节点”。它本身不存业务数据，主要负责监控、选主和故障转移。

## Redis常见面试题&详解

### 如何解决缓存击穿？

缓存击穿说的是某个热点 key 刚好失效，大量请求同时打进来，结果都绕过 Redis 去查数据库，数据库压力瞬间升高。解决思路一般有三类。

第一是加互斥锁，只让一个线程去查数据库并重建缓存，其他线程等结果；这里最好做双重检查，拿到锁后再看一次缓存，避免重复查库。

第二是热点数据提前预热，比如大促前把核心商品信息提前放进 Redis。

第三是热点 key 逻辑不过期，也就是缓存里不直接设置短 TTL，而是在 value 里维护过期时间，由后台异步刷新。

### 如何解决缓存穿透？

缓存穿透指的是请求的数据本来就不存在，缓存查不到，数据库也查不到。如果这种请求很多，缓存就失去了拦截作用，压力会直接打到数据库上，恶意请求尤其容易触发这个问题。

解决时一般不会只靠单一手段。第一层可以用布隆过滤器，把明显不存在的 key 直接挡在 Redis 和数据库之前；第二层可以做空值缓存，数据库查不到时也缓存一个短 TTL 的空结果，避免同一个不存在 key 反复打库；如果同一个 key 在短时间内并发很高，还可以加互斥锁，避免多个线程同时查库。实际项目里更常见的是组合使用：先过布隆过滤器，再查缓存和空值缓存，必要时加锁回源，回源为空再写入短期空值。

这里要注意一个工程细节：布隆过滤器和空值缓存都会带来额外维护成本。布隆过滤器需要处理数据新增后的同步问题，空值缓存要控制 TTL 和容量，避免被大量恶意 key 撑爆内存。

### 如何解决缓存雪崩？

![images/DeHubuu52onwIhx70gbcTt5sn4x.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/0b315a8f6d814110bffb04ca3aa4e324.png)

images/DeHubuu52onwIhx70gbcTt5sn4x.png

缓存雪崩指的是大量 key 在同一时间失效，或者 Redis 整体不可用，导致请求集中打到数据库。它和缓存击穿的区别在于：击穿通常是单个热点 key，雪崩是大面积失效。

解决雪崩要从“避免同时失效”和“后端兜底”两条线考虑。过期时间不要设置成完全一样，可以加随机偏移，让 key 分散过期；核心热点数据可以做预热或逻辑过期，由后台异步刷新；缓存失效后回源数据库时，要加本地锁或分布式锁控制并发，避免同一批请求同时压到数据库。更稳的系统还会配合限流、降级、熔断和多级缓存，防止 Redis 或数据库某一层出问题后把压力继续向下传。

如果面试继续追问“大 key 或缓存数据过多怎么办”，可以从业务和架构两侧回答。业务侧要重新梳理哪些数据真的适合放 Redis，避免把低频、超大、生命周期不清晰的数据都塞进缓存；架构侧可以考虑拆分 key、设置合理过期时间、使用集群分片，必要时把分析型或海量数据转到更合适的存储系统，例如 ClickHouse、Hadoop 或搜索引擎，而不是让 Redis 承担所有职责。

# 计算机基础

## 操作系统

#### 1\. 什么是进程和线程？

进程是操作系统进行资源分配的基本单位，可以理解成一个正在运行的程序实例。它有独立的内存空间、文件描述符、进程控制块等资源。线程则是进程内部的执行单元，是 CPU 调度执行的基本单位。一个进程里可以有多个线程，这些线程共享进程的内存和资源，但各自有自己的程序计数器、栈和寄存器。比如浏览器可以是一个进程，页面渲染、网络请求、用户交互等任务可能由不同线程协同完成。

#### 2\. 为什么要使用多线程？

使用多线程主要是为了提高响应能力和资源利用率。当一个线程因为 IO、网络请求或磁盘操作阻塞时，其他线程仍然可以继续执行；在多核 CPU 环境下，多个线程也可以并行处理不同任务。对 Java 后端来说，多线程常用于接口异步处理、批量任务、消息消费、定时调度等场景，但线程不是越多越好，线程数量过多反而会增加上下文切换和资源竞争。

#### 3\. 进程有哪几种状态？

进程状态可以按生命周期理解：刚开始是创建状态，操作系统分配资源并初始化 PCB；准备好但还没拿到 CPU 时是就绪状态；真正占用 CPU 执行时是运行状态；如果等待 IO、锁或其他事件，就会进入阻塞状态；执行结束或异常退出后进入终止状态，由操作系统回收资源。

#### 4\. 什么是死锁？

死锁是指两个或多个进程相互等待对方释放资源，而陷入无限期等待的状态。例如，进程A持有资源1并等待资源2，进程B持有资源2并等待资源1，两者都无法继续执行，形成死锁。

#### 5\. 解决死锁的方法？

解决死锁可以从三个方向看。预防死锁是在设计阶段破坏死锁条件，比如规定统一的加锁顺序，避免循环等待；避免死锁是在资源分配前判断风险，比如银行家算法；检测与解除死锁则是允许问题发生，但通过监控或检测算法发现后，再终止部分进程、剥夺资源或重启恢复。工程里更常见的是控制加锁顺序、缩小锁范围、设置超时时间和保留排查手段。

#### 6\. 产生死锁的4个必要条件？

死锁需要同时满足互斥、持有并等待、不可剥夺和循环等待四个条件。只要破坏其中任意一个，死锁就不会形成。实际面试里常把这四个条件和解决方案放在一起问，比如“固定加锁顺序”就是为了破坏循环等待。

#### 7\. 操作系统有哪些功能？

操作系统的核心职责是管理硬件资源，并向上层应用提供统一接口。具体来说，它负责进程调度和通信，决定 CPU 给谁用；负责内存分配、回收和虚拟内存，保证不同进程之间互不干扰；负责文件系统和 IO 设备，把磁盘、网卡、终端等硬件封装成可使用的抽象；同时还通过系统调用、命令行或图形界面向用户和程序提供访问入口。

#### 8\. 常见的操作系统有哪些？

常见操作系统可以按使用场景理解：桌面端常见 Windows、macOS 和 Linux；服务器端以 Linux 最常见，也有 Windows Server 和 Unix；移动端有 Android、iOS、HarmonyOS；嵌入式场景还会出现 VxWorks、QNX 等实时或专用系统。

## 计算机网络

#### TCP 和 UDP的区别？

TCP（传输控制协议）和UDP（用户数据报协议）是TCP/IP协议族中两种重要的传输层协议，核心区别如下：
| 对比维度 | TCP | UDP |
| --- | --- | --- |
| 连接性 | 面向连接（需建立连接后通信） | 无连接（直接发送数据，无需建立连接） |
| 可靠性 | 提供可靠传输（通过确认、重传等机制） | 不可靠传输（不保证数据到达或顺序） |
| 传输效率 | 效率较低（需处理连接、确认等开销） | 效率较高（头部开销小，无额外控制机制） |
| 数据边界 | 无数据边界（数据被视为字节流） | 有数据边界（每次发送为独立数据报） |
| 拥塞控制 | 支持（避免网络拥塞） | 不支持（无拥塞控制机制） |
| 适用场景 | 对可靠性要求高的场景（如文件传输、网页浏览） | 对实时性要求高的场景（如视频通话、直播） |

#### TCP 的三次握手和四次挥手？

##### 三次握手

![images/Png4bmulNoNcTIxWTXwcDuUhnVd.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/50d846c83f4b44ab8df042b1f0147ecf.png)

images/Png4bmulNoNcTIxWTXwcDuUhnVd.png

**第一次握手**

客户端向[服务器](https://cloud.tencent.com/product/cvm?from_column=20065&from=20065)发出连接请求报文，这时报文首部中的同部位SYN=1，同时随机生成初始序列号 seq=x，此时，TCP客户端进程进入了 SYN-SENT（同步已发送状态）状态。TCP规定，SYN报文段（SYN=1的报文段）不能携带数据，但需要消耗掉一个序号。这个三次握手中的开始。表示客户端想要和服务端建立连接。

**第二次握手**

TCP服务器收到请求报文后，如果同意连接，则发出确认报文。确认报文中应该 ACK=1，SYN=1，确认号是ack=x+1，同时也要为自己随机初始化一个序列号 seq=y，此时，TCP服务器进程进入了SYN-RCVD（同步收到）状态。这个报文也不能携带数据，但是同样要消耗一个序号。这个报文带有SYN(建立连接)和ACK(确认)标志，询问客户端是否准备好。

**第三次握手**

TCP客户进程收到确认后，还要向服务器给出确认。确认报文的ACK=1，ack=y+1，此时，TCP连接建立，客户端进入ESTABLISHED（已建立连接）状态。

TCP规定，ACK报文段可以携带数据，但是如果不携带数据则不消耗序号。这里客户端表示我已经准备好。

**思考：为什么要三次握手呢，有人说两次握手就好了**

举例：已失效的连接请求报文段。

client发送了第一个连接的请求报文，但是由于网络不好，这个请求没有立即到达服务端，而是在某个网络节点中滞留了，直到某个时间才到达server

本来这已经是一个失效的报文，但是server端接收到这个请求报文后，还是会想client发出确认的报文，表示同意连接。

假如不采用三次握手，那么只要server发出确认，新的建立就连接了，但其实这个请求是失效的请求，client是不会理睬server的确认信息，也不会向服务端发送确认的请求

但是server认为新的连接已经建立起来了，并一直等待client发来数据，这样，server的很多资源就没白白浪费掉了

采用三次握手就是为了防止这种情况的发生，server会因为收不到确认的报文，就知道client并没有建立连接。这就是三次握手的作用。

##### 四次挥手

![images/QNPLbSdnKokpbnxGH8CcZaPOn0e.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/1d1459965817491cb4f1abe2d24c28d6.png)

images/QNPLbSdnKokpbnxGH8CcZaPOn0e.png

**第一次挥手**

TCP发送一个**FIN(结束)**，用来关闭客户到服务端的连接。

客户端进程发出连接释放报文，并且停止发送数据。释放数据报文首部，FIN=1，其序列号为seq=u（等于前面已经传送过来的数据的最后一个字节的序号加1），

此时，客户端进入FIN-WAIT-1（终止等待1）状态。 TCP规定，FIN报文段即使不携带数据，也要消耗一个序号。

**第二次挥手**

服务端收到这个FIN，他发回一个**ACK(确认)，**确认收到序号为收到序号+1，和SYN一样，一个FIN将占用一个序号。

服务器收到连接释放报文，发出确认报文，ACK=1，ack=u+1，并且带上自己的序列号seq=v，此时，服务端就进入了CLOSE-WAIT（关闭等待）状态。

TCP服务器通知高层的应用进程，客户端向服务器的方向就释放了，这时候处于半关闭状态，即客户端已经没有数据要发送了，但是服务器若发送数据，客户端依然要接受。

这个状态还要持续一段时间，也就是整个CLOSE-WAIT状态持续的时间。

客户端收到服务器的确认请求后，此时，客户端就进入FIN-WAIT-2（终止等待2）状态，等待服务器发送连接释放报文（在这之前还需要接受服务器发送的最后的数据）。

**第三次挥手**

服务端发送一个**FIN(结束)**到客户端，服务端关闭客户端的连接。

服务器将最后的数据发送完毕后，就向客户端发送连接释放报文，FIN=1，ack=u+1，由于在半关闭状态，服务器很可能又发送了一些数据

假定此时的序列号为seq=w，此时，服务器就进入了LAST-ACK（最后确认）状态，等待客户端的确认。

**第四次挥手**

客户端发送**ACK(确认)**报文确认，并将确认的序号+1，这样关闭完成。

客户端收到服务器的连接释放报文后，必须发出确认，ACK=1，ack=w+1，而自己的序列号是seq=u+1，此时，客户端就进入了TIME-WAIT（时间等待）状态。

注意此时TCP连接还没有释放，必须经过2∗∗MSL（最长报文段寿命）的时间后，当客户端撤销相应的TCB后，才进入CLOSED状态。

服务器只要收到了客户端发出的确认，立即进入CLOSED状态。同样，撤销TCB后，就结束了这次的TCP连接。可以看到，服务器结束TCP连接的时间要比客户端早一些。

思考：那么为什么是4次挥手呢？

为了确保数据能够完成传输。

关闭连接时，当收到对方的FIN报文通知时，它仅仅表示对方没有数据发送给你了；但未必你所有的数据都全部发送给对方了

所以你可以未必会马上会关闭SOCKET,也即你可能还需要发送一些数据给对方之后，再发送FIN报文给对方来表示你同意现在可以关闭连接了，所以它这里的ACK报文和FIN报文多数情况下都是分开发送的。

可能有人会有疑问，tcp我握手的时候为何ACK(确认)和SYN(建立连接)是一起发送。挥手的时候为什么是分开的时候发送呢.

因为当Server端收到Client端的SYN连接请求报文后，可以直接发送SYN+ACK报文。其中ACK报文是用来应答的，SYN报文是用来同步的。

但是关闭连接时，当Server端收到FIN报文时，很可能并不会立即关闭 SOCKET，所以只能先回复一个ACK报文，告诉Client端，“你发的FIN报文我收到了”。只有等到我Server端所有的报文都发送完了，我才能发送FIN报文，因此不能一起发送。故需要四步**挥手**。

思考:客户端突然挂掉了怎么办？

正常连接时，客户端突然挂掉了，如果没有措施处理这种情况，那么就会出现客户端和服务器端出现长时期的空闲。

解决办法是在服务器端设置保活计时器，每当服务器收到客户端的消息，就将计时器复位。超时时间通常设置为2小时。

若服务器超过2小时没收到客户的信息，他就发送探测报文段。若发送了10个探测报文段，每一个相隔75秒，还没有响应就认为客户端出了故障，因而终止该连接。

#### TCP如何保证传输的可靠性？

TCP 的可靠性不是靠某一个机制完成的，而是一整套控制链路共同保证。发送端给数据编号，接收端通过 ACK 确认收到的数据；如果超时没有收到确认，或者收到重复 ACK，就会触发重传。为了避免发送太快压垮接收端，TCP 使用滑动窗口做流量控制；为了避免把整个网络打爆，又通过慢启动、拥塞避免、快速重传、快速恢复等机制做拥塞控制。再加上校验和机制，接收方可以发现损坏的数据包并丢弃，等待发送方重传。

#### 使用TCP 的协议有哪些？

TCP 常用于对可靠性要求高的应用层协议，比如 HTTP/HTTPS、FTP、SMTP/POP3/IMAP、SSH 等。DNS 大多数查询走 UDP，但区域传输或响应较大的部分场景也可能使用 TCP。

#### HTTP状态码有哪些？

HTTP 状态码可以按首位数字理解。1xx 表示请求还在处理中，比如 100 Continue；2xx 表示成功，最常见的是 200 OK，创建资源时可能返回 201 Created；3xx 表示重定向或缓存命中，比如 301 永久迁移、302 临时迁移、304 表示资源未修改，可以继续使用缓存。4xx 通常是客户端请求有问题，比如 400 参数错误、401 未认证、403 无权限、404 资源不存在；5xx 则是服务端处理出错，比如 500 内部错误、503 服务暂时不可用。

#### HTTP 和 HTTPS的区别？
| 对比维度 | HTTP | HTTPS |
| --- | --- | --- |
| 安全性 | 明文传输（数据易被窃听或篡改） | 加密传输（基于SSL/TLS协议，数据安全） |
| 端口 | 默认端口80 | 默认端口443 |
| 证书 | 无需证书 | 需要CA机构颁发的SSL证书 |
| 性能 | 速度快（无加密开销） | 速度稍慢（需握手、加密解密过程） |
| 适用场景 | 非敏感数据传输（如公开新闻） | 敏感数据传输（如支付、登录） |

#### HTTP/1.0 和 HTTP/1.1 的区别？

HTTP/1.0 默认偏短连接，每次请求通常都要重新建立 TCP 连接；HTTP/1.1 支持长连接，一个连接可以复用多次请求，减少握手成本。HTTP/1.1 还补充了 PUT、DELETE、OPTIONS 等方法，引入更细的缓存控制字段，如 Cache-Control、ETag，并要求请求携带 Host，从而支持同一台服务器托管多个域名。除此之外，HTTP/1.1 支持分块传输编码（Transfer-Encoding: chunked），服务端可以边生成边发送，不必提前知道完整响应体大小。

#### Cookie 和 Session 的区别？
| 对比维度 | Cookie | Session |
| --- | --- | --- |
| 存储位置 | 客户端（浏览器本地） | 服务器端（内存或数据库） |
| 安全性 | 较低（明文存储，易被篡改） | 较高（数据在服务器，客户端仅存Session ID） |
| 存储大小 | 有限制（通常4KB以内） | 无严格限制（取决于服务器配置） |
| 生命周期 | 可设置过期时间（持久Cookie）或会话结束后失效 | 通常随会话结束失效（或服务器设置超时） |
| 用途 | 保存用户偏好、登录状态标识等 | 保存用户会话数据（如购物车、登录信息） |

#### GET 和 POST 请求的区别？

GET 通常用于获取资源，语义上应该是安全、幂等的，也就是不改变服务器状态；POST 通常用于提交数据、创建资源或触发业务动作，可能改变服务器状态。GET 参数一般放在 URL 上，容易被浏览器历史、日志和缓存记录；POST 数据通常放在请求体里，不会直接暴露在 URL 中，但这不等于加密，真正的安全仍然要依赖 HTTPS。缓存方面，GET 更容易被浏览器或中间缓存利用，POST 默认一般不缓存。

#### 网络分层模型

常见的网络分层模型有两种，一种是偏理论的 OSI 七层模型，一种是实际工程中更常用的 TCP/IP 四层模型。OSI 模型把网络通信拆得更细，便于理解每一层职责；TCP/IP 模型则更贴近真实协议栈。

1. **OSI七层模型**（理论模型）： 
 
 ![images/Erb5bjG1TohdwJxfpkQcdaXknec.png](https://hxsay.com:19000/hxsay/blog-imgs/wechat/f7b8aee35d0a44c18e9c0da5d36de472.png)

- 物理层：传输比特流（如网线、网卡）。 
 
- 数据链路层：处理帧传输，检测错误（如MAC地址、以太网协议）。 
 
- 网络层：负责路由和寻址（如IP协议、ICMP）。 
 
- 传输层：提供端到端通信（如TCP、UDP）。 
 
- 会话层：管理会话连接（如RPC协议）。 
 
- 表示层：处理数据格式转换（如加密、压缩）。 
 
- 应用层：直接为用户提供服务（如HTTP、FTP）。

1. **TCP/IP四层模型**（实际应用模型）：

- 网络接口层（对应OSI物理层+数据链路层）。 
 
- 网络层（对应OSI网络层）。 
 
- 传输层（对应OSI传输层）。 
 
- 应用层（对应OSI会话层+表示层+应用层）。 
 \#### 常见网络协议
- **应用层**：HTTP、HTTPS、FTP、SMTP、POP3、DNS、SSH、Telnet。 
 
- **传输层**：TCP、UDP、SCTP（流控制传输协议）。 
 
- **网络层**：IP（IPv4/IPv6）、ICMP（网络控制报文，如ping）、ARP（地址解析，IP转MAC）、RIP（路由信息协议）。 
 
- **数据链路层**：以太网协议、PPP（点对点协议）、VLAN（虚拟局域网）。 
 
- **物理层**：Ethernet（以太网）、Wi-Fi（无线局域网协议）。 ## 数据结构

[数据结构](https://ecnhcesakwkz.feishu.cn/wiki/QtVfwj7syil1HdkQ7gwcnHbfnue)

# 央国企知识星球

延伸资料可参考的[知识星球](https://mp.weixin.qq.com/s?__biz=MzkzMjI0MDY3Mw==&mid=2247485557&idx=1&sn=ff41558a80b34e37a7c8c4c4823e2b9f&chksm=c25f843bf5280d2d9b7a9170c4d2d2d95253f7035fbb03a05d8de01b9798a0d001cf4c3464d0#rd)，央国企招聘准备除了技术复习，还需要持续关注岗位信息、招聘节奏、笔试面试题型和目标单位偏好。

星球内部包含中国石油、国家电网、中国烟草等垄断央企的笔试/面试题目以及解析，还包含中航工业、中国电科、中国五矿等航天、矿业央企准备的技术路线等。

还会每天推送全国各地的央国企招聘信息，帮助大家及时获取各地的央国企的投递机会，减少信息差。

如果需要持续获取招聘信息和题目资料，可以扫描下方二维码了解：

![images/TshDbmtFZowz31xBCxZcrcAynPd.jpg](https://hxsay.com:19000/hxsay/blog-imgs/wechat/b992357b834f423da542dbf952a50e71.jpg)

images/TshDbmtFZowz31xBCxZcrcAynPd.jpg
